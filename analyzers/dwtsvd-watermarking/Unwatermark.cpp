#include "Unwatermark.h"
#include "Model.h"
#include <fstream>
#include <opencv2/opencv.hpp>

int main(int argc, char *argv[]) {
  if (argc < 2) {
    std::cerr << "Usage:\n\tdiunwatermark [image] [extra] [...output]\n";
    return -1;
  }
  cv::Mat img_color = cv::imread(argv[1], cv::IMREAD_COLOR);
  if (img_color.empty()) {
    std::cerr << "Image load failed\n";
    return -1;
  }
  cv::Mat cover_image_ycrcb;
  cv::cvtColor(img_color, cover_image_ycrcb, cv::COLOR_BGR2YCrCb);

	cv::Mat base = cv::imread(argv[2], cv::IMREAD_COLOR);
  cv::Mat base_image_ycrcb;
  cv::cvtColor(base, base_image_ycrcb, cv::COLOR_BGR2YCrCb);

  int w = img_color.cols & ~1;
  int h = img_color.rows & ~1;
  img_color = cover_image_ycrcb(cv::Rect(0, 0, w, h)).clone();

  // Split BGR channels
  std::vector<cv::Mat> channels;
  cv::split(img_color, channels);

  cv::Mat i64f;
  channels[0].convertTo(i64f, CV_64F);

  std::ifstream fs;
  fs.open(argv[3], std::fstream::in | std::fstream::binary);
  WatermarkExtraData data;
  WatermarkExtraStream::read(fs, data);
  fs.close();

	std::vector<cv::Mat> c2;
	cv::split(base_image_ycrcb, c2);
	cv::Mat i64fb;
	c2[0].convertTo(i64fb, CV_64F);

  cv::Mat extracted_watermark;
  Unwatermark::run(i64f, WatermarkMethod::DWTSVD, data, extracted_watermark, i64fb);

  extracted_watermark.convertTo(extracted_watermark, CV_8U);
  cv::imwrite(argv[4], extracted_watermark);

  return 0;
}
