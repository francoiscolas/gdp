#ifndef POWERPOINTVIEWER_H
#define POWERPOINTVIEWER_H

#include "itemviewer.h"

class QLabel;

class PixmapLabel;

class PowerPointViewer : public ItemViewer
{
    Q_OBJECT

    public:
        ITEMVIEWER_CONSTRUCTOR_DECL(PowerPointViewer)

    public:
        virtual QByteArray saveState() const;
        virtual void restoreState(const QByteArray& state);

        int currentSlide() const;
        void setCurrentSlide(int index);

    private:
        void setupUi();

        bool loadSlidesFromCache();
        bool makeSlidesFromPpt();

    private:
        int          m_currentSlide;
        bool         m_hasError;
        QLabel*      m_pagingLbl;
        PixmapLabel* m_slideDisplay;
        QList<QPixmap> m_slides;
};

#endif // POWERPOINTVIEWER_H
