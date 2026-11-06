class PostController {
 static async index(req, res) {
    try {
      const posts = await prisma.post.findMany({});
      return res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
}


static async store(req, res) {
    const authUser = req.user;
    const { title, content } = req.body;

    try {
        const post = await prisma.post.create({
            data: {
                user_id: authUser.id,
                title,
                content
            }
        });
        return res.status(201).json({message: "Post created successfully", post});
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

}


export default PostController;