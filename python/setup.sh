ARCH=`uname -m`
echo $ARCH
if test $ARCH == "x86_64"; then
    echo 1
fi