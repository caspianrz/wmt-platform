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
  cv::Mat HSw;
  cv::Mat Uw;
  cv::Mat Vw;
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
};

#endif
