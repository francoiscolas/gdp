#include "itemviewerfactory.h"

#include <QMimeDatabase>

#include "itemviewer.h"

static ItemViewerFactory* s_instance = NULL;

ItemViewerFactory* ItemViewerFactory::instance()
{
    if (s_instance == NULL)
        s_instance = new ItemViewerFactory();
    return s_instance;
}

ItemViewerFactory::ItemViewerFactory()
{
}

ItemViewer* ItemViewerFactory::create(const QUrl& itemUrl, QWidget* parent)
{
    QString mimeType = QMimeDatabase().mimeTypeForFile(itemUrl.toString()).name();

    if (m_types.contains(mimeType))
        return qobject_cast<ItemViewer*>(
            m_types[mimeType].newInstance(Q_ARG(QUrl, itemUrl), Q_ARG(QWidget*, parent))
        );
    return NULL;
}

bool ItemViewerFactory::supports(const QUrl& itemUrl)
{
    QString mimeType = QMimeDatabase().mimeTypeForFile(itemUrl.toString()).name();
    return m_types.contains(mimeType);
}

bool ItemViewerFactory::registerType(const QString& type, const QMetaObject& metaObject)
{
    if (m_types.contains(type) == false) {
        m_types.insert(type, metaObject);
        return true;
    }
    return false;
}

bool ItemViewerFactory::unregisterType(const QString& type)
{
    return (m_types.remove(type) > 0);
}
