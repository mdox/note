FROM alpine
WORKDIR /app
COPY . .
RUN apk add --update nodejs npm
RUN npm install
RUN npm install -D ts-node typescript
RUN npx prisma db push
RUN npm run seed-prod
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
