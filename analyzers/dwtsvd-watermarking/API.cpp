#include "Crow.h"
#include "Model.h"
#include "Unwatermark.h"
#include "Watermark.h"
#include "base64.h"
#include "opencv2/imgcodecs.hpp"
#include <archive.h>
#include <archive_entry.h>
#include <opencv2/opencv.hpp>
#include <string>

// ----- crow route -----

int main(int argc, char *argv[]) {
  crow::SimpleApp app;

  CROW_ROUTE(app, "/strategy")
      .methods("GET"_method)([](const crow::request &req) {
        crow::json::wvalue res_json;

        const std::string response = "{"
                                     "\"embed\":{"
                                     "\"request\":{"
                                     "\"base\":\"image;base64\","
                                     "\"watermark\":\"image;base64\","
                                     "\"alpha\":\"opt/double\""
                                     "},"
                                     "\"response\":{"
                                     "\"image\":\"image;base64\","
                                     "\"data\":\"bin;base64\""
                                     "}"
                                     "},"
                                     "\"extract\":{"
                                     "\"request\":{"
                                     "\"image\":\"image;base64\","
                                     "\"data\":\"bin;base64\""
                                     "},"
                                     "\"response\":{"
                                     "\"watermark\":\"image;base64\""
                                     "}"
                                     "}"
                                     "}";

        auto parsed = crow::json::load(response);
        if (!parsed) {
          res_json["reason"] = "Invalid json response";
          res_json["non-parsed"] = response;
          return crow::response(500, res_json);
        }
        res_json = parsed;
        return crow::response(200, res_json);
      });

  CROW_ROUTE(app, "/embed")
      .methods("POST"_method)([](const crow::request &req) {
        auto json = crow::json::load(req.body);
        crow::json::wvalue res_json;

        if (!json || !json.has("base") || !json.has("watermark")) {
          res_json["reason"] = "Either base or watermark field missing.";
          return crow::response(400, res_json);
        }

        std::vector<unsigned char> base_image = base64_decode(json["base"].s());
        std::vector<unsigned char> watermark_image =
            base64_decode(json["watermark"].s());

        cv::Mat img_color = cv::imdecode(base_image, cv::IMREAD_COLOR);

        if (img_color.empty()) {
          res_json["reason"] = "Malformed base image.";
          return crow::response(400, res_json);
        }

        cv::Mat watermark = cv::imdecode(watermark_image, cv::IMREAD_GRAYSCALE);

        if (watermark.empty()) {
          res_json["reason"] = "Malformed watermark image.";
          return crow::response(400, res_json);
        }

        cv::Mat cover_image_ycrcb;
        cv::cvtColor(img_color, cover_image_ycrcb, cv::COLOR_BGR2YCrCb);

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
        double alpha = 0.1;

        if (json.has("alpha")) {
          alpha = json["alpha"].d();
        }

        Watermark::watermark(i64f, w64f, WatermarkMethod::DWTHDSVD, alpha,
                             watermarked_image, extra);

        watermarked_image.convertTo(watermarked_image, CV_8U);
        std::vector<cv::Mat> ycrcb_channels = {watermarked_image, channels[1],
                                               channels[2]};
        cv::Mat ycrcb_image;
        cv::merge(ycrcb_channels, ycrcb_image); // CV_8UC3 or CV_64FC3
        cv::Mat bgr_image;
        cv::cvtColor(ycrcb_image, bgr_image, cv::COLOR_YCrCb2BGR);

        std::vector<uchar> buf;
        cv::imencode(".jpg", bgr_image, buf); // force jpeg encoding

        res_json["image"] = base64_encode(buf.data(), buf.size());

        std::vector<uchar> data = WatermarkExtraStream::convert_vec(extra);
        res_json["data"] = base64_encode(data.data(), data.size());

        return crow::response{200, res_json};
      });

  CROW_ROUTE(app, "/extract")
      .methods("POST"_method)([](const crow::request &req) {
        auto json = crow::json::load(req.body);
        crow::json::wvalue res_json;

        if (!json || !json.has("image") || !json.has("data")) {
          res_json["reason"] = "Either image or data field missing.";
          return crow::response(400, res_json);
        }
        std::vector<unsigned char> image = base64_decode(json["image"].s());
        std::vector<unsigned char> data = base64_decode(json["data"].s());

        cv::Mat img_color = cv::imdecode(image, cv::IMREAD_COLOR);
        if (img_color.empty()) {
          res_json["reason"] = "Malformed base image.";
          return crow::response(400, res_json);
        }
        cv::Mat cover_image_ycrcb;
        cv::cvtColor(img_color, cover_image_ycrcb, cv::COLOR_BGR2YCrCb);

        int w = img_color.cols & ~1;
        int h = img_color.rows & ~1;
        img_color = cover_image_ycrcb(cv::Rect(0, 0, w, h)).clone();

        // Split BGR channels
        std::vector<cv::Mat> channels;
        cv::split(img_color, channels);

        cv::Mat i64f;
        channels[0].convertTo(i64f, CV_64F);
        auto WMData = WatermarkExtraStream::parse_vec(data);

        cv::Mat extracted_watermark;
        Unwatermark::run(i64f, WatermarkMethod::DWTHDSVD, WMData,
                         extracted_watermark);

        extracted_watermark.convertTo(extracted_watermark, CV_8U);
        std::vector<uchar> buf;
        cv::imencode(".jpg", extracted_watermark, buf);
        res_json["watermark"] = base64_encode(buf.data(), buf.size());

        return crow::response(200, res_json);
      });

  app.port(10001).run();
  return 0;
}
