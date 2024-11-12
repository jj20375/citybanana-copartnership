# 安裝 ubuntu
FROM gcr.io/citybanana/citybanana-nextjs-conpartnership:node-18-18-2

# 安裝時區相關套件
ENV DEBIAN_FRONTEND=noninteractive
RUN sed -i -e 's/archive.ubuntu.com\|security.ubuntu.com/old-releases.ubuntu.com/g' /etc/apt/sources.list
RUN apt-get update && apt-get install -y tzdata

# 設置時區環境變數
ENV TZ=Asia/Shanghai

# 設置容器內部的系統時區
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /www/citybanana

COPY . .

RUN yarn install
RUN yarn run build