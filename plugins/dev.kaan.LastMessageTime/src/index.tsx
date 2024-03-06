import { common, Injector, webpack } from "replugged";

const injector = new Injector();
const { Heading } = webpack.getByProps("Heading");
const Classes = webpack.getByProps("eyebrow");
const { defaultColor } = webpack.getByProps("lineClamp2Plus");
const lastFetchedMap = new Map<string, { timestamp: number; fetchedTime: number }>();
async function GetUserLastSentMessageTimestamp({ guild, userId }) {
  const id = guild
    ? guild.id
    : common.channels.getDMFromUserId(userId) ??
    common.channels.getLastSelectedChannelId() ??
    common.channels.getCurrentlySelectedChannelId();
  const lastFetched = lastFetchedMap.get(`${userId}-${id}`);
  const isExpired =
    !lastFetched?.fetchedTime || Date.now() - lastFetched?.fetchedTime > 1000 * 60 * 5;
  if (
    (!lastFetched?.timestamp || isExpired) &&
    !lastFetched?.isFetching &&
    !Array.from(lastFetchedMap.values()).some((v) => v.isFetching)
  ) {
    lastFetchedMap.set(`${userId}-${id}`, { isFetching: true });
    const timestamp = id
      ? await common.api
        .get({
          // @ts-ignore
          url: guild
            ? common.constants.Endpoints.SEARCH_GUILD(id)
            : common.constants.Endpoints.SEARCH_CHANNEL(id),
          query: {
            author_id: userId,
            // @ts-ignore
            include_nsfw: true,
          },
        })
        .then((c) =>
          new Date(c?.body?.messages?.[0]?.[0]?.timestamp).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        )
      : "Error Fetching Timestamp";
    lastFetchedMap.set(`${userId}-${id}`, {isFetching: false, timestamp, fetchedTime: timestamp });
  }
  return lastFetchedMap.get(`${userId}-${id}`)?.fetchedTime;
}

export function start()
{
  injector.after(
    webpack.getBySource(".Messages.USER_PROFILE_MEMBER_SINCE", { raw: true }).exports,
    "default",
    (a, b, c) => {
      const [timestamp, setTimestamp] = common.React.useState();
      common.React.useEffect(() => {
        (async () => {
          setTimestamp(await GetUserLastSentMessageTimestamp(a[0]));
        })();
      }, [lastFetchedMap, a[0]]);
      if (Array.isArray(b?.props?.children))
        b.props.children.push(
          // @ts-ignore
          <>
            <Heading className={Classes.eyebrow} style={{ padding: "10px 0" }}>
              LAST MESSAGE SENT
            </Heading>
            <span className={Classes["text-sm/normal"] + " " + defaultColor}>{timestamp}</span>
          </>,
        );
    },
  );
}
export function stop(): void {
  injector.uninjectAll();
}
