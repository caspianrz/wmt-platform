#ifndef DIW_DWTSVD_H
#define DIW_DWTSVD_H

#include "Model.h"
#include <opencv2/opencv.hpp>

#include "DWT.h"
class DWTSVD {
public:
  static void run(cv::Mat cover_image, cv::Mat watermark_logo, double alpha,
                  cv::Mat &watermarked_image, WatermarkExtraData &extra) {
    cv::Mat LL, LH, HL, HH;
    DWT::dwt2D(cover_image, LL, LH, HL, HH);

    cv::Mat HUw, HVw, HSw;
    cv::Mat Uw, Sw, Vw;
    cv::SVD::compute(LL, HSw, HUw, HVw);
    cv::SVD::compute(watermark_logo, Sw, Uw, Vw);

    cv::Mat HSw_hat = (HSw + alpha * Sw);
    cv::Mat H_hat = HUw * cv::Mat::diag(HSw_hat) * HVw;
    DWT::idwt2D(H_hat, LH, HL, HH, watermarked_image);

		extra.R = 1;
    extra.alpha = alpha;
		extra.HSw = HSw;
		extra.Uw = Uw;
		extra.Vw = Vw;
  }

  static void unrun(cv::Mat watermarked_image, WatermarkExtraData	extra,
                    cv::Mat &watermark) {
    //cv::Mat Sw_hat = (HSbw_hat - extra.HSw) / extra.alpha;
    //watermark = extra.Uw * cv::Mat::diag(Sw_hat) * extra.Vw;
  }
};

#endif
