#ifndef ITEMVIEWERFACTORY_H
#define ITEMVIEWERFACTORY_H

#include <QCoreApplication>
#include <QMap>
#include <QMetaObject>

class QWidget;

class ItemViewer;

#define gItemViewerFactory (ItemViewerFactory::instance())

class ItemViewerFactory
{
    public:
        static ItemViewerFactory* instance();

    private:
        ItemViewerFactory();

    public:
        ItemViewer* create(const QUrl& itemUrl, QWidget* parent = NULL);

        bool supports(const QUrl& itemUrl);

        bool registerType(const QString& type, const QMetaObject& metaObject);
        bool unregisterType(const QString& type);

    private:
        QMap<QUrl,QMetaObject> m_types;
};

#endif // ITEMVIEWERFACTORY_H
