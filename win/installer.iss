#define APP_NAME "Groupe de Prière"

[Setup]
; App settings
AppName={#APP_NAME}
AppVersion={#APP_VERSION}

; Build settings
Compression=lzma
OutputDir=..
OutputBaseFilename=groupe-de-priere-v{#APP_VERSION}
SolidCompression=yes
VersionInfoVersion={#APP_VERSION_SHORT}

; Install settings
DefaultDirName={pf}\{#APP_NAME}
DefaultGroupName={#APP_NAME}
;DisableProgramGroupPage=yes

; Wizard settings
ShowLanguageDialog=no


[Types]
Name: "full"; Description: "Installation avec les dépendances"
Name: "compact"; Description: "Installation sans les dépendances"
Name: "custom"; Description: "Installation personnalisée"; Flags: iscustom


[Components]
Name: main; Description: "Groupe de Prière"; Types: full compact custom; Flags: fixed disablenouninstallwarning
Name: libreoffice; Description: "LibreOffice"; Types: full; Flags: disablenouninstallwarning
Name: imagemagick; Description: "ImageMagick"; Types: full; Flags: disablenouninstallwarning
Name: ghostscript; Description: "GhostScript"; Types: full; Flags: disablenouninstallwarning


[Files]
Source: "..\build\src\release\gdp.exe"; DestDir: "{app}"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\bin\Qt5Core.dll"; DestDir: "{app}"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\bin\Qt5Gui.dll"; DestDir: "{app}"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\bin\Qt5Svg.dll"; DestDir: "{app}"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\bin\Qt5Widgets.dll"; DestDir: "{app}"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\bin\icudt52.dll"; DestDir: "{app}"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\bin\icuin52.dll"; DestDir: "{app}"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\bin\icuuc52.dll"; DestDir: "{app}"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\bin\libgcc_s_dw2-1.dll"; DestDir: "{app}"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\bin\libstdc++-6.dll"; DestDir: "{app}"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\bin\libwinpthread-1.dll"; DestDir: "{app}"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\accessible\qtaccessiblewidgets.dll"; DestDir: "{app}\accessible"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\iconengines\qsvgicon.dll"; DestDir: "{app}\iconengines"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\imageformats\qdds.dll"; DestDir: "{app}\imageformats"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\imageformats\qgif.dll"; DestDir: "{app}\imageformats"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\imageformats\qicns.dll"; DestDir: "{app}\imageformats"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\imageformats\qico.dll"; DestDir: "{app}\imageformats"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\imageformats\qjp2.dll"; DestDir: "{app}\imageformats"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\imageformats\qjpeg.dll"; DestDir: "{app}\imageformats"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\imageformats\qmng.dll"; DestDir: "{app}\imageformats"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\imageformats\qsvg.dll"; DestDir: "{app}\imageformats"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\imageformats\qtga.dll"; DestDir: "{app}\imageformats"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\imageformats\qtiff.dll"; DestDir: "{app}\imageformats"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\imageformats\qwbmp.dll"; DestDir: "{app}\imageformats"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\imageformats\qwebp.dll"; DestDir: "{app}\imageformats"; Flags: ignoreversion; Components: main
Source: "{#QT_DIR}\plugins\platforms\qwindows.dll"; DestDir: "{app}\platforms"; Flags: ignoreversion; Components: main
Source: "dependencies\{#LIBREOFFICE}"; DestDir: "{tmp}"; Flags: ignoreversion deleteafterinstall; Components: libreoffice
Source: "dependencies\{#IMAGEMAGICK}"; DestDir: "{tmp}"; Flags: ignoreversion deleteafterinstall; Components: imagemagick
Source: "dependencies\{#GHOSTSCRIPT}"; DestDir: "{tmp}"; Flags: ignoreversion deleteafterinstall; Components: ghostscript


[Run]
Filename: "msiexec.exe"; Parameters: "/i ""{tmp}\{#LIBREOFFICE}"""; Flags: skipifsilent; Components: libreoffice
Filename: "{tmp}\{#IMAGEMAGICK}"; Flags: skipifsilent; Components: imagemagick
Filename: "{tmp}\{#GHOSTSCRIPT}"; Flags: skipifsilent; Components: ghostscript


[Icons]
Name: "{group}\{#APP_NAME}"; Filename: "{app}\gdp.exe"
Name: "{group}\{cm:UninstallProgram,{#APP_NAME} {#APP_VERSION}}"; Filename: "{uninstallexe}"
Name: "{commondesktop}\{#APP_NAME}"; Filename: "{app}\gdp.exe"


[Run]
Filename: "{app}\gdp.exe"; Description: "{cm:LaunchProgram,{#APP_NAME}}"; Flags: nowait postinstall skipifsilent

