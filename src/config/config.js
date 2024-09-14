import 'dotenv/config'

export const config = {
    PORT: 8080,
    MONGO_URL: `mongodb+srv://josefranciscoarce:${process.env.MONGODB_PASS}@cluster0.gvg9s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    DB_NAME: "musicDB"
}