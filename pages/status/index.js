import useSWR from "swr";

async function fetchAPI(key) {
  let url = key;

  if (process.env.NODE_ENV === "development") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    url = `${baseUrl}${key}`;
  }

  const response = await fetch(`${url}`);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 5000,
  });

  let updatedAtText = "Carregando...";
  let statusPage = <div>Última atualização: {updatedAtText}</div>;

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-br");
    statusPage = (
      <div>
        Última atualização: {updatedAtText}
        <p>Conexões abertas: {data.dependencies.database.connections_opened}</p>
        <p>
          Número máximo de conexões:{" "}
          {data.dependencies.database.max_connections}
        </p>
        <p>Versão do banco de dados: {data.dependencies.database.version}</p>
      </div>
    );
  }

  return statusPage;
}
