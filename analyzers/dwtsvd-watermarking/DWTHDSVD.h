#ifndef DIW_DWTHDSVD_H
#define DIW_DWTHDSVD_H

#include "DWT.h"
#include "Hess.h"
#include "Model.h"
#include <cmath>
#include <cstdint>
#include <opencv2/opencv.hpp>
#include <thread>
#include <unordered_map>

#ifdef DIW_DEBUG_MODE
#include <chrono>
#endif

class DWTHDSVD {
public:
  static void run(cv::Mat cover_image, cv::Mat watermark_logo, double alpha,
                  cv::Mat &watermarked_logo, WatermarkExtraData &extra) {
    double M = std::max(cover_image.rows, cover_image.cols);
    double N = std::max(watermark_logo.rows, watermark_logo.cols);
    double R = std::log2(M / N);

    std::unordered_map<uint32_t, cv::Mat[4]> coefs;

    DWT::dwt2D(cover_image, coefs[0][0], coefs[0][1], coefs[0][2], coefs[0][3]);
    int32_t i = 1;
    for (; i < R; i++) {
      DWT::dwt2D(coefs[i - 1][0], coefs[i][0], coefs[i][1], coefs[i][2],
                 coefs[i][3]);
    }

    cv::Mat H, P;
    Hessenberg::hessenberg(coefs[R - 1][0], H, P);

    cv::Mat HSw, HUw, HVw;
    cv::Mat Sw, Uw, Vw;

    std::thread t1([&]() {
#ifdef DIW_DEBUG_MODE
      // Get the start time
      auto start = std::chrono::high_resolution_clock::now();
#endif
      cv::SVD::compute(H, HSw, HUw, HVw);
#ifdef DIW_DEBUG_MODE
      auto end = std::chrono::high_resolution_clock::now();
      auto duration =
          std::chrono::duration_cast<std::chrono::microseconds>(end - start);

      // Output the duration in microseconds
      std::cout << "Function took " << duration.count() << " microseconds."
                << std::endl;
#endif
    });

    std::thread t2([&]() {
#ifdef DIW_DEBUG_MODE
      auto start = std::chrono::high_resolution_clock::now();
#endif
      cv::SVD::compute(watermark_logo, Sw, Uw, Vw);

#ifdef DIW_DEBUG_MODE
      auto end = std::chrono::high_resolution_clock::now();
      auto duration =
          std::chrono::duration_cast<std::chrono::microseconds>(end - start);
      std::cout << "Function took " << duration.count() << " microseconds."
                << std::endl;
#endif // DIW_DEBUG_MODE
    });

    t1.join();
    t2.join();

    cv::Mat HSw_hat = (HSw + alpha * Sw);
    cv::Mat H_hat = HUw * cv::Mat::diag(HSw_hat) * HVw;

    cv::Mat LL_hat = P * H_hat * P.t();

    cv::Mat LL_hat2;

    for (; i - 1 > 0; i--) {
      std::cout << i << std::endl;
      DWT::idwt2D(LL_hat, coefs[i][1], coefs[i][2], coefs[i][3], LL_hat2);
      LL_hat = LL_hat2;
    }
    DWT::idwt2D(LL_hat, coefs[0][1], coefs[0][2], coefs[0][3],
                watermarked_logo);

    extra.R = R;
    extra.alpha = static_cast<uint32_t>(alpha * 256);
    extra.HSw = HSw;
    extra.Uw = Uw;
    extra.Vw = Vw;
  }

  static void unrun(cv::Mat watermarked_image, WatermarkExtraData extra,
                    cv::Mat &watermark) {
    std::unordered_map<uint32_t, cv::Mat[4]> coef;
    DWT::dwt2D(watermarked_image, coef[0][0], coef[0][1], coef[0][2],
               coef[0][3]);
    int32_t i = 1;
    for (; i < extra.R; i++) {
      DWT::dwt2D(coef[i - 1][0], coef[i][0], coef[i][1], coef[i][2],
                 coef[i][3]);
    }
    cv::Mat Hw, Pw;
    Hessenberg::hessenberg(coef[i - 1][0], Hw, Pw);

    cv::Mat HUw_hat, HSbw_hat, HVw_hat;
    cv::SVD::compute(Hw, HSbw_hat, HUw_hat, HVw_hat);

    cv::Mat Sw_hat =
        (HSbw_hat - extra.HSw) / static_cast<double>(extra.alpha / 256);
    watermark = extra.Uw * cv::Mat::diag(Sw_hat) * extra.Vw;
  }
};

#endif
