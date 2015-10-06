BUILD_DIR    = build
BUILD_TARGET = $(BUILD_DIR)/src/release/gdp.exe
PKG_DIR 	 = GdP-$(shell git describe --tags)
PKG_TARGET   = $(PKG_DIR)/gdp.exe

all: build package

build: $(BUILD_TARGET)

$(BUILD_TARGET):
	mkdir -p $(BUILD_DIR) \
	&& cd $(BUILD_DIR) \
	&& qmake $(CURDIR) \
	&& $(MAKE)

package:
	mkdir -p $(PKG_DIR) \
	&& cp -p $(BUILD_TARGET) $(PKG_DIR) \
	&& windeployqt --no-translations $(PKG_TARGET)

clean:
	rm -rf $(BUILD_DIR)

fclean: clean
	rm -rf $(PKG_DIR)

.PHONY: build
