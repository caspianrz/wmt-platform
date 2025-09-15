#ifndef DIW_WATERMARK_H
#define DIW_WATERMARK_H

#include "DWTHDSVD.h"
#include "DWTSVD.h"

class Watermark {
public:
  static void watermark(cv::Mat cover_image, cv::Mat watermark_logo,
                        WatermarkMethod method, double alpha,
                        cv::Mat &watermarked_image, WatermarkExtraData &wm_extra) {
    switch (method) {
    case WatermarkMethod::DWTSVD:
      DWTSVD::run(cover_image, watermark_logo, alpha, watermarked_image,
                  wm_extra);
      break;
    case WatermarkMethod::DWTHDSVD:
      DWTHDSVD::run(cover_image, watermark_logo, alpha, watermarked_image,
                    wm_extra);
      break;
    }
  }
};

#endif
