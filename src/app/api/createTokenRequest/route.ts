import Ably from 'ably/promises'
import {NextRequest, NextResponse} from 'next/server'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'

export const GET = async (req: NextRequest) => {
  const client = new Ably.Realtime(process.env.ABLY_CLIENT_API_KEY)

  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2,
  })

  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: randomName,
  })

  // res.status(200).json(tokenRequestData)
  return NextResponse.json(tokenRequestData)
}
