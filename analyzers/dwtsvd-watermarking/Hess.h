#ifndef DIW_HESS_H
#define DIW_HESS_H

#include <opencv2/opencv.hpp>

class Hessenberg {
public:
  static void hessenberg(const cv::Mat &A, cv::Mat &H, cv::Mat &P) {
    CV_Assert(A.rows == A.cols);
    int n = A.rows;
    H = A.clone();
    P = cv::Mat::eye(n, n, CV_64F);

    for (int k = 0; k < n - 2; ++k) {
      // Build Householder vector
      cv::Mat x = H(cv::Range(k + 1, n), cv::Range(k, k + 1)).clone();
      cv::Mat e = cv::Mat::zeros(x.size(), CV_64F);
      double alpha = cv::norm(x);
      if (x.at<double>(0, 0) >= 0)
        alpha = -alpha;
      e.at<double>(0, 0) = alpha;

      cv::Mat u = x - e;
      double norm_u = cv::norm(u);
      if (norm_u < 1e-10)
        continue;
      u /= norm_u;

      // Compute H = (I - 2uuᵀ)·H·(I - 2uuᵀ)
      cv::Mat I = cv::Mat::eye(n - k - 1, n - k - 1, CV_64F);
      cv::Mat Hk = I - 2 * (u * u.t());

      // Left transformation: H = QH
      cv::Mat H_sub = H(cv::Range(k + 1, n), cv::Range(k, n));
      H_sub = Hk * H_sub;
      H_sub.copyTo(H(cv::Range(k + 1, n), cv::Range(k, n)));

      // Right transformation: H = HQ
      cv::Mat H_sub2 = H(cv::Range(0, n), cv::Range(k + 1, n));
      H_sub2 = H_sub2 * Hk;
      H_sub2.copyTo(H(cv::Range(0, n), cv::Range(k + 1, n)));

      // Accumulate P
      cv::Mat P_sub = P(cv::Range(k + 1, n), cv::Range(0, n));
      P_sub = Hk * P_sub;
      P_sub.copyTo(P(cv::Range(k + 1, n), cv::Range(0, n)));
    }

    P = P.t(); // Final orthogonal matrix
  }
};

#endif
