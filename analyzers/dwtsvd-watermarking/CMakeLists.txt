cmake_minimum_required(VERSION 3.10)

project(
  iembedding
  VERSION 1.0.0
  LANGUAGES CXX)

# include(FetchContent)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

#set(BUILD_opencv_world OFF)
#set(BUILD_LIST core,imgproc,imgcodecs,highgui)
#set(BUILD_TESTS OFF)
#set(BUILD_PERF_TESTS OFF)
#set(BUILD_INSTALL_TARGETS OFF)

#FetchContent_Declare(
#  OpenCV
#  GIT_REPOSITORY https://github.com/opencv/opencv.git
#  GIT_TAG 4.11.0
#  GIT_SHALLOW TRUE
#  GIT_PROCESS TRUE)
#FetchContent_MakeAvailable(OpenCV)

find_package( OpenCV REQUIRED )
include_directories( ${OpenCV_INCLUDE_DIRS} )

add_executable(diwatermark Watermark.cpp DWT.cpp)
target_link_libraries( diwatermark ${OpenCV_LIBS} )
add_executable(diunwatermark Unwatermark.cpp DWT.cpp)
target_link_libraries( diunwatermark ${OpenCV_LIBS} )

#target_include_directories(diwatermark PRIVATE
#	${CMAKE_CURRENT_BINARY_DIR}
#	${OpenCV_SOURCE_DIR}/include
#	${OpenCV_SOURCE_DIR}/modules/core/include
#	${OpenCV_SOURCE_DIR}/modules/imgproc/include
#	${OpenCV_SOURCE_DIR}/modules/imgcodecs/include
#	${OpenCV_SOURCE_DIR}/modules/highgui/include
#)

#target_include_directories(diunwatermark PRIVATE
#	${CMAKE_CURRENT_BINARY_DIR}
#	${OpenCV_SOURCE_DIR}/include
#	${OpenCV_SOURCE_DIR}/modules/core/include
#	${OpenCV_SOURCE_DIR}/modules/imgproc/include
#	${OpenCV_SOURCE_DIR}/modules/imgcodecs/include
#	${OpenCV_SOURCE_DIR}/modules/highgui/include
#)

#target_link_libraries(diwatermark PRIVATE opencv_core opencv_imgproc opencv_imgcodecs opencv_highgui)

#target_link_libraries(diunwatermark PRIVATE opencv_core opencv_imgproc opencv_imgcodecs opencv_highgui)

