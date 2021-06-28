FROM node:lts-alpine AS builder

COPY . /app
WORKDIR /app

ENV YARN_VERSION 1.22.4
RUN yarn policies set-version $YARN_VERSION

RUN yarn install && yarn build

# # # # #

FROM httpd:2.4-alpine

ENV TZ America/Sao_Paulo

COPY --from=builder /app/build/ /usr/local/apache2/htdocs
RUN touch /usr/local/apache2/htdocs/.htaccess && \
    echo "RewriteEngine On" >> /usr/local/apache2/htdocs/.htaccess && \
    echo "RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]" >> /usr/local/apache2/htdocs/.htaccess && \
    echo "RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d" >> /usr/local/apache2/htdocs/.htaccess && \
    echo "RewriteRule ^ - [L]" >> /usr/local/apache2/htdocs/.htaccess && \
    echo "RewriteRule . /index.html [L]" >> /usr/local/apache2/htdocs/.htaccess && \
    echo '<FilesMatch "\.(html|htm|js|css)$">' >> /usr/local/apache2/htdocs/.htaccess && \
    echo 'FileETag None' >> /usr/local/apache2/htdocs/.htaccess && \
    echo '<IfModule headers_module>' >> /usr/local/apache2/htdocs/.htaccess && \
    echo 'Header unset ETag' >> /usr/local/apache2/htdocs/.htaccess && \
    echo 'Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"' >> /usr/local/apache2/htdocs/.htaccess && \
    echo 'Header set Pragma "no-cache"' >> /usr/local/apache2/htdocs/.htaccess && \
    echo 'Header set Expires "Wed, 12 Jan 1980 05:00:00 GMT"' >> /usr/local/apache2/htdocs/.htaccess && \
    echo 'Header set Access-Control-Allow-Origin "*"' >> /usr/local/apache2/htdocs/.htaccess && \
    echo 'Header set Access-Control-Allow-Headers "origin, x-requested-with, content-type"' >> /usr/local/apache2/htdocs/.htaccess && \
    echo 'Header set Access-Control-Allow-Methods "PUT, GET, POST, DELETE, OPTIONS"' >> /usr/local/apache2/htdocs/.htaccess && \
    echo '</IfModule>' >> /usr/local/apache2/htdocs/.htaccess && \
    echo '</FilesMatch>' >> /usr/local/apache2/htdocs/.htaccess

RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's#AllowOverride [Nn]one#AllowOverride All#' /usr/local/apache2/conf/httpd.conf

EXPOSE 80
EXPOSE 443