#include "Watermark.h"
#include "Model.h"

#include <fstream>
#include <iostream>

#include <opencv2/opencv.hpp>

int main(int argc, char *argv[]) {
  if (argc < 4) {
    std::cerr << "Usage:\n\tdiwatermark [image] [watermark] [image_output] "
                 "[extra_output]\n";
    return -1;
  }

  cv::Mat img_color = cv::imread(argv[1], cv::IMREAD_COLOR);
  if (img_color.empty()) {
    std::cerr << "Image load failed\n";
    return -1;
  }
  cv::Mat cover_image_ycrcb;
  cv::cvtColor(img_color, cover_image_ycrcb, cv::COLOR_BGR2YCrCb);

  cv::Mat watermark = cv::imread(argv[2], cv::IMREAD_GRAYSCALE);

  // Ensure even size
  int w = img_color.cols & ~1;
  int h = img_color.rows & ~1;
  img_color = cover_image_ycrcb(cv::Rect(0, 0, w, h)).clone();

  // Split BGR channels
  std::vector<cv::Mat> channels;
  cv::split(img_color, channels); // channels[0] = Y, [1] = Cb, [2] = Cr

  cv::Mat i64f, w64f;
  channels[0].convertTo(i64f, CV_64F);
  watermark.convertTo(w64f, CV_64F);

  cv::Mat watermarked_image;
  WatermarkExtraData extra;
  Watermark::watermark(i64f, w64f, WatermarkMethod::DWTHDSVD, 0.7,
                       watermarked_image, extra);

  watermarked_image.convertTo(watermarked_image, CV_8U);
  std::vector<cv::Mat> ycrcb_channels = {watermarked_image, channels[1],
                                         channels[2]};
  cv::Mat ycrcb_image;
  cv::merge(ycrcb_channels, ycrcb_image); // CV_8UC3 or CV_64FC3
  cv::Mat bgr_image;
  cv::cvtColor(ycrcb_image, bgr_image, cv::COLOR_YCrCb2BGR);
  cv::imwrite(argv[3], bgr_image, {});

  std::ofstream fs;
  fs.open(argv[4], std::fstream::binary | std::fstream::out);
  WatermarkExtraStream::write(fs, extra);
  fs.close();
  return 0;
}
