export OPENBLAS_NUM_THREADS=4

pip install --upgrade pip

pip install numpy pandas plotly requests

#ARCH=`uname -m`
#if test $ARCH == "x86_64"; then
#    conda install -c conda-forge tensorflow
#elif test $ARCH == "aarch64"; then
#    conda install -c kumatea tensorflow
#else
#    echo "$ARCH is Not supported format."
#fi

cd /assets/
python ./predict.py & python ./server.py