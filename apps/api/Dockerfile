FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN npm ci
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npm run build -w packages/shared \
 && DATABASE_URL=postgresql://build:build@localhost:5432/build npm run prisma:generate -w apps/api \
 && npm run build -w apps/api \
 && npm prune --omit=dev

FROM node:24-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/shared ./packages/shared
COPY --from=build /app/apps/api ./apps/api
USER node
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["npm", "run", "start:prod"]
