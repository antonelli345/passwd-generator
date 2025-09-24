# Usa imagem leve do Nginx
FROM nginx:alpine

# Remove arquivos default do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos da sua pasta web para o Nginx
COPY web/ /usr/share/nginx/html/

# Expõe porta 80
EXPOSE 80

# Mantém o Nginx rodando em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
