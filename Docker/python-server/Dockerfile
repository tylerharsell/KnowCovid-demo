From python:3.8
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get -y update && apt-get -y install net-tools nano wget curl 
WORKDIR /root
RUN pip3 install pandas flask requests requests py_eureka_client \
    flask_restful flask_cors scipy smart_open cython sklearn 
RUN wget https://files.pythonhosted.org/packages/97/4f/cd282d20e799011dec50c3da1cd645bd5d83c819c7f4ed718e916b3af127/gensim-4.1.2-cp38-cp38-manylinux_2_12_x86_64.manylinux2010_x86_64.whl
RUN pip3 install /root/gensim-4.1.2-cp38-cp38-manylinux_2_12_x86_64.manylinux2010_x86_64.whl
ADD pythonServices /root/pythonServices
WORKDIR /root/pythonServices
ENTRYPOINT ["python3"]
CMD ["server.py"]