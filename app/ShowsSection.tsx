interface Event {
  datetime: string
  venue: {
    city: string
    country: string
    name: string
  }
  url: string
  lineup: string[]
}

interface ShowsSectionProps {
  events: Event[]
  loading: boolean
}

const ShowsSectionComponent = ({ events, loading }: ShowsSectionProps) => {
  return (
    <div className="mb-32 md:ml-auto md:mr-0 md:w-1/2 md:pr-12 w-full">
      <div className="relative">
        <div className="md:pl-8 pb-8">
          <h2 className="text-4xl font-bold text-black mb-2 uppercase tracking-wide text-center md:text-left">
            Upcoming Shows
          </h2>
          <p className="text-sm italic text-black mb-6 text-center md:text-left">
            Lots of shows coming in 2026 - dates to be revealed soon
          </p>
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 text-base text-black">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-6">
                {events.map((event, index) => (
                  <a
                    key={index}
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group border-b border-black/10 pb-4 last:border-0 last:pb-0 hover:opacity-70 transition"
                  >
                    <p className="text-xs text-black/60 mb-1">
                      {new Date(event.datetime).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="font-bold text-lg mb-1">
                      {event.venue.city}, {event.venue.country}
                    </p>
                    <p className="text-sm">
                      {event.venue.name}{" "}
                      {event.lineup.length > 1
                        ? `(with ${event.lineup.filter((a) => a !== "Anteater").join(", ")})`
                        : ""}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-black/60">Check back soon for new dates!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowsSectionComponent
