#ifndef DIW_UNWATERMARK_H
#define DIW_UNWATERMARK_H

#include "DWTHDSVD.h"
#include "Model.h"
#include "DWTSVD.h"
#include <opencv2/opencv.hpp>

class Unwatermark {
public:
  static void run(cv::Mat watermarked_image, WatermarkMethod method,
                  WatermarkExtraData extra, cv::Mat &extracted_watermark) {
    switch (method) {
    case WatermarkMethod::DWTSVD:
      DWTSVD::unrun(watermarked_image, extra, extracted_watermark);
      break;
    case WatermarkMethod::DWTHDSVD:
			DWTHDSVD::unrun(watermarked_image, extra, extracted_watermark);
      break;
    }
  }
};

#endif
