#ifndef ITEMVIEWER_H
#define ITEMVIEWER_H

#include <QDir>
#include <QUrl>
#include <QWidget>

#include "itemviewerfactory.h"

#define ITEMVIEWER_CONSTRUCTOR_DECL(Class) \
    Q_INVOKABLE Class(const QUrl& itemUrl, QWidget* parent = NULL);

#define ITEMVIEWER_REGISTER(Class, Types) \
    static void registerType##Class() \
    { \
        foreach (const QString& type, QStringList(Types)) \
            gItemViewerFactory->registerType(type, Class::staticMetaObject); \
    } \
    Q_COREAPP_STARTUP_FUNCTION(registerType##Class)

class QHBoxLayout;
class QVBoxLayout;

class ItemViewer : public QWidget
{
    Q_OBJECT

    public:
        ItemViewer(const QUrl& itemUrl, QWidget* parent = NULL);
        virtual ~ItemViewer();

    public:
        virtual QByteArray saveState() const = 0;
        virtual void restoreState(const QByteArray& state) = 0;

        QDir cacheDir() const;

        const QUrl& itemUrl() const;

        ItemViewer* buddy() const;
        template<typename T> T buddy() const {
            return qobject_cast<T>(buddy()); }
        void setBuddy(ItemViewer* buddy);

        bool isControlsVisible() const;
        void setControlsVisible(bool visible);
        void showControls();
        void hideControls();

        ItemViewer* clone() const;

    protected:
        QVBoxLayout* contentLayout() const;
        QHBoxLayout* controlsLayout() const;

    private:
        void setupUi();

    private:
        QUrl m_itemUrl;
        QHBoxLayout* m_headerLayout;
        QVBoxLayout* m_contentLayout;
        QHBoxLayout* m_controlsLayout;
        ItemViewer* m_buddy;
};

#endif // ITEMVIEWER_H
