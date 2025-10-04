cmake_minimum_required(VERSION 3.10)

project(
  dwthdsvd
  VERSION 1.0.0
  LANGUAGES CXX)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(OpenCV REQUIRED)
include_directories(${OpenCV_INCLUDE_DIRS})

add_executable(dwthdsvdw Watermark.cpp DWT.cpp)
target_link_libraries(dwthdsvdw ${OpenCV_LIBS})
add_executable(dwthdsvduw Unwatermark.cpp DWT.cpp)
target_link_libraries(dwthdsvduw ${OpenCV_LIBS})

# Install Watermark to bin
install(TARGETS dwthdsvdw RUNTIME DESTINATION bin)

# Install Unwatermark to bin
install(TARGETS dwthdsvduw RUNTIME DESTINATION bin)

install(
  FILES strategy.json
  DESTINATION etc/wmtplatform/dwthdsvd
  COMPONENT config)
