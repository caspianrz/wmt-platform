cmake_minimum_required(VERSION 3.10)

project(
  dwthdsvd
  VERSION 1.0.0
  LANGUAGES CXX)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(OpenCV REQUIRED)
include_directories(${OpenCV_INCLUDE_DIRS})

add_executable(diwatermark Watermark.cpp DWT.cpp)
target_link_libraries(diwatermark ${OpenCV_LIBS})
add_executable(diunwatermark Unwatermark.cpp DWT.cpp)
target_link_libraries(diunwatermark ${OpenCV_LIBS})

# Install diwatermark to bin
install(TARGETS diwatermark RUNTIME DESTINATION bin)

# Install diunwatermark to bin
install(TARGETS diunwatermark RUNTIME DESTINATION bin)

install(
  FILES strategy.json
  DESTINATION etc/wmtplatform/dwthdsvd
  COMPONENT config)
