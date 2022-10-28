pip install --upgrade pip

pip install numpy pandas plotly requests https://github.com/squeaky-pl/japronto/archive/master.zip

#ARCH=`uname -m`
#if test $ARCH == "x86_64"; then
#    conda install -c conda-forge tensorflow
#elif test $ARCH == "aarch64"; then
#    conda install -c kumatea tensorflow
#else
#    echo "$ARCH is Not supported format."
#fi

cd /assets/
python ./predict.py