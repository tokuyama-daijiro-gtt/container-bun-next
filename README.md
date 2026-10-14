# Next.js + Hono Bun monorepo

Bun WorkspacesでNext.js、Hono、共有Zod契約を管理するモノレポです。ブラウザからHono APIへ直接アクセスする経路は持たず、Next.jsのServer Actionだけが内部APIを呼び出します。

## Structure

```text
apps/web/          Next.js App Router
apps/api/          Hono API
packages/shared/   Zod request/response contracts
```

`package.json`はルートと各アプリにだけ配置しています。共有依存、Biome、TypeScript、Vitestはルートで管理し、アプリ固有の依存は各アプリで管理します。

## Development

VS CodeのDev Containersから、通常は`Next.js + Hono (Bun)`を選択します。Zscalerが必要な環境だけ`Next.js + Hono (Bun + Zscaler)`を選択し、ホストの`~/.certs/zscaler.crt`を用意してください。依存関係はDev Container内の名前付きvolumeにインストールされます。

```bash
bun run dev
```

Webは <http://localhost:3000> で起動します。APIは同じコンテナの`127.0.0.1:3001`だけで待ち受け、ホストにはforwardしません。

## Checks

```bash
bun run check
bun run typecheck
bun run test
bun run build
```

テストランナーにはVitestを使用しています。

## Production image

```bash
docker build --target production -t container-bun-next .
docker run --rm -p 3000:3000 container-bun-next
```

本番イメージはNext.js standalone、バンドル済みHono API、2プロセスを監視する小さな起動スクリプトだけを含みます。公開ポートは3000だけです。

Zscalerが必要なビルド環境では、証明書をBuildKit secretとして一時的に渡せます。証明書はイメージにコピーされません。

```bash
docker build --target production \
  --secret id=zscaler_cert,src="$HOME/.certs/zscaler.crt" \
  -t container-bun-next .
```
