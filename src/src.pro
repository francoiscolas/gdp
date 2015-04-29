TEMPLATE = app
QT       = core gui widgets svg axcontainer
TARGET   = gdp
CONFIG  += c++11

SOURCES += \
    app.cpp \
    biglabel.cpp \
    itemviewer.cpp \
    itemviewerfactory.cpp \
    itemviewerscreen.cpp \
    itemviewerwrapper.cpp \
    itemswidget.cpp \
    main.cpp \
    mainwindow.cpp \
    pixmaplabel.cpp \
    powerpointviewer.cpp \
    session.cpp
HEADERS += \
    app.h \
    biglabel.h \
    itemviewer.h \
    itemviewerfactory.h \
    itemviewerscreen.h \
    itemviewerwrapper.h \
    itemswidget.h \
    mainwindow.h \
    pixmaplabel.h \
    powerpointviewer.h \
    session.h
RESOURCES += \
    resources.qrc