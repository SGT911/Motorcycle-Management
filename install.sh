#!/bin/sh
ACTUAL_DIR=$(dirname $0)
INSTALL_DIR=/usr/lib/motorcycle_management
INSTALL_USER=$1
if [ "$INSTALL_USER" = "" ]; then 
	INSTALL_USER=www-data
fi

mkdir -p $INSTALL_DIR

echo "========================="
echo "=== Building FrontEnd ==="
echo "========================="

cd $ACTUAL_DIR/frontend
yarn && yarn build || exit 1

cp -rv ./build $INSTALL_DIR/frontend

echo "=========================="
echo "=== Installing Service ==="
echo "=========================="

cd ..
cp systemd.service /usr/lib/systemd/system/motorcycle_management.service
sed -i "s/USER/$INSTALL_USER/" /usr/lib/systemd/system/motorcycle_management.service

echo "========================"
echo "=== Building BackEnd ==="
echo "========================"

cp -rv ./backend $INSTALL_DIR/.
cp -rv ./config $INSTALL_DIR/.

cd $INSTALL_DIR/backend
python -m virtualenv venv
source ./venv/bin/activate && pip --no-cache-dir install -r requirements.txt && deactivate

chown $INSTALL_USER:$INSTALL_USER -R $INSTALL_DIR
