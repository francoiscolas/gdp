#!/bin/sh

PROGDIR=`dirname $0`
PROGDIR=`cd $PROGDIR && pwd`

CLEANUP=`test "$1" != "clean" ; echo $?`

error () {
    echo "Error: $1."
    exit 1
}

#
# Select the download program

if which wget &> /dev/null ; then
    DL="wget -O -"
elif which curl &> /dev/null ; then
    DL="curl"
else
    error "You need to setup wget or curl to continue"
fi

#
# Detect running OS

if [ `uname` = "Darwin" ] ; then
    OS=mac
elif [ `expr substr $(uname -s) 1 10` = "MINGW32_NT" ] ; then
    OS=windows
elif [ `expr substr $(uname -s) 1 5` = "Linux" ]; then
    OS=linux
else
    error "Unsupported operating system"
fi

#
# libpoppler-qt5

if [ $OS = "linux" ] ; then
    sudo apt install libpoppler-qt5-dev
elif [ $OS = "windows" ] ; then
    if [ ! $CLEANUP -eq 1 ] ; then
        LIBPOPPLER_URL=http://poppler.freedesktop.org/poppler-0.38.0.tar.xz
        LIBPOPPLER_TAR=$(basename $LIBPOPPLER_URL)
        LIBPOPPLER_DIR=${LIBPOPPLER_TAR%.*.*}
        QT_ROOT=`qmake -query QT_INSTALL_PREFIX`
        QT_INCDIR=`qmake -query QT_INSTALL_HEADERS`
        QT_LIBDIR=`qmake -query QT_INSTALL_LIBS`
        QT_BINDIR=`qmake -query QT_INSTALL_BINS`
        export MAKE="mingw32-make"
        export POPPLER_QT5_CFLAGS="-I$QT_INCDIR -I$QT_INCDIR/QtCore -I$QT_INCDIR/QtWidgets -I$QT_INCDIR/QtGui -I$QT_INCDIR/QtXml"
        export POPPLER_QT5_LIBS="-L$QT_LIBDIR -lQt5Core -lQt5Widgets -lQt5Gui -lQt5Xml"
        export POPPLER_QT5_TEST_CFLAGS="-I$QT_INCDIR -I$QT_INCDIR/QtTest -I$QT_INCDIR/QtCore"
        export POPPLER_QT5_TEST_LIBS="-L$QT_LIBDIR -lQt5Test -lQt5Core"
        (rm -rf $LIBPOPPLER_DIR \
        && $DL $LIBPOPPLER_URL | tar -xJ \
        && cd $LIBPOPPLER_DIR \
        && ./configure \
            --prefix=$QT_ROOT \
            --disable-poppler-qt4 \
            --disable-gtk-test \
            --disable-utils \
        && $MAKE \
        && $MAKE install \
        && cd - \
        && rm -rf $LIBPOPPLER_DIR) || exit 1
    else
        rm -vrf \
            $QT_BINDIR/bin/libpoppler* \
            $QT_INCDIR/include/poppler \
            $QT_LIBDIR/lib/libpoppler* \
            $QT_LIBDIR/lib/pkgconfig/poppler*
    fi
fi
