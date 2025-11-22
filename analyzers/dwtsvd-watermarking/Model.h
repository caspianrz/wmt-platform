#ifndef IEM_MODEL_H
#define IEM_MODEL_H

#include <cstdint>
#include <fstream>
#include <opencv2/opencv.hpp>

enum class WatermarkMethod {
  DWTSVD,
  DWTHDSVD,
};

struct WatermarkExtraData {
  double R;
  double alpha;
  cv::Mat HSw, Uw, Vw;
};

class WatermarkExtraStream {
public:
  static void read(std::ifstream &file, WatermarkExtraData &data) {
    file.read(reinterpret_cast<char *>(&data.R), sizeof(data.R));
    file.read(reinterpret_cast<char *>(&data.alpha), sizeof(data.alpha));
    uint32_t HSw_rows, HSw_cols, HSw_type;
    file.read(reinterpret_cast<char *>(&HSw_rows), sizeof(HSw_rows));
    file.read(reinterpret_cast<char *>(&HSw_cols), sizeof(HSw_cols));
    file.read(reinterpret_cast<char *>(&HSw_type), sizeof(HSw_type));
    data.HSw = cv::Mat(HSw_rows, HSw_cols, HSw_type);
    file.read(reinterpret_cast<char *>(data.HSw.data),
              data.HSw.total() * data.HSw.elemSize());

    uint32_t Uw_rows, Uw_cols, Uw_type;
    file.read(reinterpret_cast<char *>(&Uw_rows), sizeof(Uw_rows));
    file.read(reinterpret_cast<char *>(&Uw_cols), sizeof(Uw_cols));
    file.read(reinterpret_cast<char *>(&Uw_type), sizeof(Uw_type));
    data.Uw = cv::Mat(Uw_rows, Uw_cols, Uw_type);
    file.read(reinterpret_cast<char *>(data.Uw.data),
              data.Uw.total() * data.Uw.elemSize());

    uint32_t Vw_rows, Vw_cols, Vw_type;
    file.read(reinterpret_cast<char *>(&Vw_rows), sizeof(Vw_rows));
    file.read(reinterpret_cast<char *>(&Vw_cols), sizeof(Vw_cols));
    file.read(reinterpret_cast<char *>(&Vw_type), sizeof(Vw_type));
    data.Vw = cv::Mat(Vw_rows, Vw_cols, Vw_type);
    file.read(reinterpret_cast<char *>(data.Vw.data),
              data.Vw.total() * data.Vw.elemSize());
  }

  static void write(std::ofstream &file, WatermarkExtraData data) {
    file.write(reinterpret_cast<char *>(&data.R), sizeof(data.R));
    file.write(reinterpret_cast<char *>(&data.alpha), sizeof(data.alpha));
    uint32_t HSw_rows = data.HSw.rows, HSw_cols = data.HSw.cols,
             HSw_type = data.HSw.type();
    file.write(reinterpret_cast<char *>(&HSw_rows), sizeof(HSw_rows));
    file.write(reinterpret_cast<char *>(&HSw_cols), sizeof(HSw_cols));
    file.write(reinterpret_cast<char *>(&HSw_type), sizeof(HSw_type));
    file.write(reinterpret_cast<char *>(data.HSw.data),
               data.HSw.total() * data.HSw.elemSize());

    uint32_t Uw_rows = data.Uw.rows, Uw_cols = data.Uw.cols,
             Uw_type = data.Uw.type();
    file.write(reinterpret_cast<char *>(&Uw_rows), sizeof(Uw_rows));
    file.write(reinterpret_cast<char *>(&Uw_cols), sizeof(Uw_cols));
    file.write(reinterpret_cast<char *>(&Uw_type), sizeof(Uw_type));
    file.write(reinterpret_cast<char *>(data.Uw.data),
               data.Uw.total() * data.Uw.elemSize());

    uint32_t Vw_rows = data.Vw.rows, Vw_cols = data.Vw.cols,
             Vw_type = data.Vw.type();
    file.write(reinterpret_cast<char *>(&Vw_rows), sizeof(Vw_rows));
    file.write(reinterpret_cast<char *>(&Vw_cols), sizeof(Vw_cols));
    file.write(reinterpret_cast<char *>(&Vw_type), sizeof(Vw_type));
    file.write(reinterpret_cast<char *>(data.Vw.data),
               data.Vw.total() * data.Vw.elemSize());
  }

  static std::vector<unsigned char> convert_vec(WatermarkExtraData data) {
    std::vector<unsigned char> buf;

    auto write_raw = [&](const void *src, size_t sz) {
      size_t old_size = buf.size();
      buf.resize(old_size + sz);
      std::memcpy(buf.data() + old_size, src, sz);
    };

    // R and alpha
    write_raw(&data.R, sizeof(data.R));
    write_raw(&data.alpha, sizeof(data.alpha));

    // ---- HSw ----
    {
      uint32_t rows = data.HSw.rows;
      uint32_t cols = data.HSw.cols;
      uint32_t type = data.HSw.type();

      write_raw(&rows, sizeof(rows));
      write_raw(&cols, sizeof(cols));
      write_raw(&type, sizeof(type));

      write_raw(data.HSw.data, data.HSw.total() * data.HSw.elemSize());
    }

    // ---- Uw ----
    {
      uint32_t rows = data.Uw.rows;
      uint32_t cols = data.Uw.cols;
      uint32_t type = data.Uw.type();

      write_raw(&rows, sizeof(rows));
      write_raw(&cols, sizeof(cols));
      write_raw(&type, sizeof(type));

      write_raw(data.Uw.data, data.Uw.total() * data.Uw.elemSize());
    }

    // ---- Vw ----
    {
      uint32_t rows = data.Vw.rows;
      uint32_t cols = data.Vw.cols;
      uint32_t type = data.Vw.type();

      write_raw(&rows, sizeof(rows));
      write_raw(&cols, sizeof(cols));
      write_raw(&type, sizeof(type));

      write_raw(data.Vw.data, data.Vw.total() * data.Vw.elemSize());
    }

    return buf;
  }

  static WatermarkExtraData parse_vec(const std::vector<unsigned char> &buf) {
    WatermarkExtraData data;
    size_t offset = 0;

    auto read_raw = [&](void *dst, size_t sz) {
      if (offset + sz > buf.size())
        throw std::runtime_error("Buffer too small");
      std::memcpy(dst, buf.data() + offset, sz);
      offset += sz;
    };

    // R and alpha
    read_raw(&data.R, sizeof(data.R));
    read_raw(&data.alpha, sizeof(data.alpha));

    auto read_mat = [&](cv::Mat &mat) {
      uint32_t rows, cols, type;
      read_raw(&rows, sizeof(rows));
      read_raw(&cols, sizeof(cols));
      read_raw(&type, sizeof(type));

      mat.create(rows, cols, type);
      read_raw(mat.data, mat.total() * mat.elemSize());
    };

    // HSw, Uw, Vw
    read_mat(data.HSw);
    read_mat(data.Uw);
    read_mat(data.Vw);

    return data;
  }
};

#endif
