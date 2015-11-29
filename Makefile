BUILD_DIR	  = build
TARGET		  = $(BUILD_DIR)/src/release/gdp.exe
VERSION		  = $(shell git describe --tags | sed -e 's|^v||')
VERSION_SHORT = $(shell echo $(VERSION) | sed -e 's|-.*||')
QT_DIR		  = $(shell qmake -query QT_INSTALL_PREFIX)

LIBREOFFICE_URL = http://download.documentfoundation.org/libreoffice/stable/5.0.3/win/x86/LibreOffice_5.0.3_Win_x86.msi
LIBREOFFICE_BIN = $(shell basename $(LIBREOFFICE_URL))

IMAGEMAGICK_URL = http://www.imagemagick.org/download/binaries/ImageMagick-6.9.2-7-Q16-x86-dll.exe
IMAGEMAGICK_BIN = $(shell basename $(IMAGEMAGICK_URL))

GHOSTSCRIPT_URL = http://downloads.ghostscript.com/public/gs918w32.exe
GHOSTSCRIPT_BIN = $(shell basename $(GHOSTSCRIPT_URL))

all: build package

build: $(TARGET)

$(TARGET):
	mkdir -p $(BUILD_DIR) \
	&& cd $(BUILD_DIR) \
	&& qmake $(CURDIR) \
	&& $(MAKE)

package:
	wget -c -P win/dependencies/ $(LIBREOFFICE_URL)
	wget -c -P win/dependencies/ $(IMAGEMAGICK_URL)
	wget -c -P win/dependencies/ $(GHOSTSCRIPT_URL)
	ISCC /dQT_DIR=$(QT_DIR) \
		/dAPP_VERSION=$(VERSION) \
		/dAPP_VERSION_SHORT=$(VERSION_SHORT) \
		/dLIBREOFFICE=$(LIBREOFFICE_BIN) \
		/dIMAGEMAGICK=$(IMAGEMAGICK_BIN) \
		/dGHOSTSCRIPT=$(GHOSTSCRIPT_BIN) \
		win/installer.iss

clean:
	rm -rf $(BUILD_DIR)

fclean: clean
	rm -rf $(PKG_DIR)

.PHONY: build $(TARGET)
