#ifndef DIW_DWT_H
#define DIW_DWT_H

#include <cassert>
#include <opencv2/opencv.hpp>

class DWT {
private:
	static const double sqrt2;
public:
  // Forward 2D Haar DWT
  static void dwt2D(const cv::Mat &input, cv::Mat &LL, cv::Mat &LH, cv::Mat &HL,
                    cv::Mat &HH) {
    CV_Assert(input.type() == CV_64F);
    CV_Assert(input.rows % 2 == 0 && input.cols % 2 == 0);

    int rows = input.rows, cols = input.cols;
    int halfRows = rows / 2, halfCols = cols / 2;

    // Temporary horizontal pass
    cv::Mat lowPass(rows, halfCols, CV_64F);
    cv::Mat highPass(rows, halfCols, CV_64F);

    for (int i = 0; i < rows; ++i) {
      const double *row = input.ptr<double>(i);
      double *lowRow = lowPass.ptr<double>(i);
      double *highRow = highPass.ptr<double>(i);
      for (int j = 0; j < halfCols; ++j) {
        double a = row[2 * j];
        double b = row[2 * j + 1];
        lowRow[j] = (a + b) / sqrt2;
        highRow[j] = (a - b) / sqrt2;
      }
    }

    // Vertical pass
    LL.create(halfRows, halfCols, CV_64F);
    LH.create(halfRows, halfCols, CV_64F);
    HL.create(halfRows, halfCols, CV_64F);
    HH.create(halfRows, halfCols, CV_64F);

    for (int j = 0; j < halfCols; ++j) {
      for (int i = 0; i < halfRows; ++i) {
        double a = lowPass.at<double>(2 * i, j);
        double b = lowPass.at<double>(2 * i + 1, j);
        LL.at<double>(i, j) = (a + b) / sqrt2;
        LH.at<double>(i, j) = (a - b) / sqrt2;

        a = highPass.at<double>(2 * i, j);
        b = highPass.at<double>(2 * i + 1, j);
        HL.at<double>(i, j) = (a + b) / sqrt2;
        HH.at<double>(i, j) = (a - b) / sqrt2;
      }
    }
  }

  // Inverse 2D Haar DWT
  static void idwt2D(const cv::Mat &LL, const cv::Mat &LH, const cv::Mat &HL,
                     const cv::Mat &HH, cv::Mat &output) {
    CV_Assert(LL.type() == CV_64F && LH.type() == CV_64F &&
              HL.type() == CV_64F && HH.type() == CV_64F);
    CV_Assert(LL.size() == LH.size() && HL.size() == HH.size() &&
              LL.size() == HL.size());

    int halfRows = LL.rows, halfCols = LL.cols;
    int rows = halfRows * 2, cols = halfCols * 2;

    cv::Mat lowPass(rows, halfCols, CV_64F);
    cv::Mat highPass(rows, halfCols, CV_64F);

    for (int j = 0; j < halfCols; ++j) {
      for (int i = 0; i < halfRows; ++i) {
        double l = LL.at<double>(i, j);
        double h = LH.at<double>(i, j);
        lowPass.at<double>(2 * i, j) = (l + h) / sqrt2;
        lowPass.at<double>(2 * i + 1, j) = (l - h) / sqrt2;

        double hl = HL.at<double>(i, j);
        double hh = HH.at<double>(i, j);
        highPass.at<double>(2 * i, j) = (hl + hh) / sqrt2;
        highPass.at<double>(2 * i + 1, j) = (hl - hh) / sqrt2;
      }
    }

    output.create(rows, cols, CV_64F);
    for (int i = 0; i < rows; ++i) {
      const double *rowLow = lowPass.ptr<double>(i);
      const double *rowHigh = highPass.ptr<double>(i);
      double *rowOut = output.ptr<double>(i);
      for (int j = 0; j < halfCols; ++j) {
        double a = rowLow[j];
        double b = rowHigh[j];
        rowOut[2 * j] = (a + b) / sqrt2;
        rowOut[2 * j + 1] = (a - b) / sqrt2;
      }
    }
  }
};

#endif
