pip install --upgrade pip

ARCH=`uname -m`
if test $ARCH == "x86_64"; then
    conda install -c conda-forge tensorflow
elif test $ARCH == "aarch64"; then
    conda install -c kumatea tensorflow
else
    echo "$ARCH is Not supported format."
fi
conda install -c conda-forge keras
