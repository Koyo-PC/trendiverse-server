pip install --upgrade pip

pip install numpy
pip install pandas
pip install plotly
pip install requests
pip install japronto

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