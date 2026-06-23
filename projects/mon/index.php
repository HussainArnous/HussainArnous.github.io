<?php
session_start();
include_once("includes/db.php");

if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit();
}

$current_user_id = $_SESSION['user']['id'];
$errors = [];

/* دالة الوقت */
function timeAgo($datetime) {
    $timestamp = strtotime($datetime);
    $difference = time() - $timestamp;

    if ($difference < 60) {
        return "Just now";
    } elseif ($difference < 3600) {
        $minutes = floor($difference / 60);
        return $minutes . " minute" . ($minutes > 1 ? "s" : "") . " ago";
    } elseif ($difference < 86400) {
        $hours = floor($difference / 3600);
        return $hours . " hour" . ($hours > 1 ? "s" : "") . " ago";
    } elseif ($difference < 604800) {
        $days = floor($difference / 86400);
        return $days . " day" . ($days > 1 ? "s" : "") . " ago";
    } elseif ($difference < 2592000) {
        $weeks = floor($difference / 604800);
        return $weeks . " week" . ($weeks > 1 ? "s" : "") . " ago";
    } elseif ($difference < 31536000) {
        $months = floor($difference / 2592000);
        return $months . " month" . ($months > 1 ? "s" : "") . " ago";
    } else {
        $years = floor($difference / 31536000);
        return $years . " year" . ($years > 1 ? "s" : "") . " ago";
    }
}

/* إضافة بوست */
if (isset($_POST['submit_post'])) {
    $content = trim($_POST['content']);

    if ($content === '') {
        $errors['content'] = "Post content cannot be empty!";
    }

    if (empty($errors)) {
        $insert = $db->prepare("INSERT INTO posts (user_id, content) VALUES (:user_id, :content)");
        $insert->execute([
            'user_id' => $current_user_id,
            'content' => $content
        ]);

        header("Location: index.php");
        exit();
    }
}

include_once("includes/header.php");

/* جلب البوستات */
$query = $db->prepare("
    SELECT 
        posts.*, 
        users.name, 
        users.avatar,
        users.headline,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as likes_count,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id AND user_id = :current_user_id) as i_liked
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    ORDER BY posts.id DESC
");
$query->execute([
    'current_user_id' => $current_user_id
]);
$posts = $query->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="row justify-content-center">
    <div class="col-md-8">

        <!-- Create Post -->
        <div class="card shadow-sm mt-4 mb-4 border-0" style="border-radius: 12px;">
            <div class="card-body p-3">
                <form method="POST">
                    <textarea name="content" class="form-control mb-3" rows="3"
                        placeholder="What's on your mind?"><?php echo htmlspecialchars($_POST['content'] ?? ''); ?></textarea>

                    <?php if (isset($errors['content'])): ?>
                        <small class="text-danger"><?php echo $errors['content']; ?></small>
                    <?php endif; ?>

                    <div class="text-end mt-2">
                        <button type="submit" name="submit_post" class="btn btn-primary">
                            <i class="bi bi-send"></i> Post
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <h4 class="mb-4 fw-bold">Recent Posts</h4>

        <?php foreach ($posts as $post): ?>
            <div id="post-<?php echo $post['id']; ?>" class="card mb-4 shadow-sm border-0" style="border-radius: 12px;">
                <div class="card-body p-4">

                    <div class="d-flex align-items-center mb-3">
                        <?php
                        $user_img = !empty($post['avatar']) ? $post['avatar'] : "img/default.png";
                        ?>
                        <img src="<?php echo htmlspecialchars($user_img); ?>"
                             class="rounded-circle me-3"
                             width="55"
                             height="55"
                             style="object-fit: cover;"
                             alt="User Avatar">

                        <div>
                            <h6 class="fw-bold mb-0">
                                <a href="profile.php?id=<?php echo $post['user_id']; ?>" class="text-dark text-decoration-none">
                                    <?php echo htmlspecialchars($post['name']); ?>
                                </a>
                            </h6>

                            <?php if (!empty($post['headline'])): ?>
                                <small class="text-muted d-block">
                                    <?php echo htmlspecialchars($post['headline']); ?>
                                </small>
                            <?php endif; ?>

                            <small class="text-muted">
                                <?php echo timeAgo($post['created_at']); ?>
                            </small>
                        </div>
                    </div>

                    <p class="mb-3"><?php echo htmlspecialchars($post['content']); ?></p>

                    <hr>

                    <div class="d-flex justify-content-between">

                        <!-- Like -->
                        <form action="like_process.php" method="POST">
                            <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">
                            <button type="submit" class="btn btn-link text-decoration-none p-0">
                                <i class="bi bi-hand-thumbs-up-fill <?php echo ($post['i_liked'] > 0) ? 'text-primary' : 'text-secondary'; ?>"></i>
                                Like (<?php echo $post['likes_count']; ?>)
                            </button>
                        </form>

                        <!-- Delete -->
                        <?php if ($post['user_id'] == $current_user_id): ?>
                            <a href="delete_post.php?post_id=<?php echo $post['id']; ?>"
                               class="text-danger"
                               onclick="return confirm('Delete this post?');">
                                Delete
                            </a>
                        <?php endif; ?>

                    </div>
                </div>
            </div>
        <?php endforeach; ?>

        <?php if (empty($posts)): ?>
            <p class="text-center text-muted mt-5">No posts yet</p>
        <?php endif; ?>

    </div>
</div>

<?php include_once("includes/footer.php"); ?>