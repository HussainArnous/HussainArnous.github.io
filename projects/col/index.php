<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require 'includes/db.php';

$search = trim($_GET['search'] ?? '');

$page = isset($_GET['page']) ? (int) $_GET['page'] : 1;

if ($page < 1) {
    $page = 1;
}

$perPage = 6;
$offset = ($page - 1) * $perPage;

$countStmt = $pdo->prepare("
    SELECT COUNT(*) AS total
    FROM collections
    JOIN users ON users.id = collections.user_id
    WHERE collections.name LIKE ?
       OR collections.description LIKE ?
       OR users.name LIKE ?
");

$countStmt->execute([
    "%$search%",
    "%$search%",
    "%$search%"
]);

$totalCollections = $countStmt->fetch()['total'];
$totalPages = ceil($totalCollections / $perPage);

$stmt = $pdo->prepare("
    SELECT
        collections.*,
        users.name AS owner_name,
        (
            SELECT COUNT(*)
            FROM items
            WHERE items.collection_id = collections.id
        ) AS item_count
    FROM collections
    JOIN users ON users.id = collections.user_id
    WHERE collections.name LIKE ?
       OR collections.description LIKE ?
       OR users.name LIKE ?
    ORDER BY collections.updated_at DESC
    LIMIT $perPage OFFSET $offset
");

$stmt->execute([
    "%$search%",
    "%$search%",
    "%$search%"
]);

$collections = $stmt->fetchAll();

include 'includes/header.php';
include 'includes/navbar.php';

?>

<div class="container mt-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Collections</h1>

        <?php if (isset($_SESSION['user_id'])): ?>
            <a href="create_collection.php" class="btn btn-<?= $theme === 'dark'? 'warning' : 'primary' ?>">
                + New Collection
            </a>
        <?php endif; ?>
    </div>

    <form method="GET" class="mb-4">
        <div class="input-group">
            <input
                type="text"
                name="search"
                class="form-control"
                placeholder="Search collections..."
                value="<?= htmlspecialchars($search) ?>">

            <button class="btn btn-<?= $theme === 'dark'? 'warning' : 'primary' ?>">
                Search
            </button>
        </div>
    </form>

    <?php if (count($collections) === 0): ?>

        <div class="alert alert-info">
            No collections found.
        </div>

    <?php endif; ?>

    <div class="row">

        <?php foreach ($collections as $collection): ?>

            <div class="col-md-4 mb-4">

                <div class="card h-100 shadow-sm">

                    <img
                        src="<?= htmlspecialchars($collection['cover_url'] ?: 'https://placehold.co/600x350?text=Collection') ?>"
                        class="card-img-top"
                        height="250"
                        alt="Collection cover">

                    <div class="card-body">

                        <h5 class="card-title">
                            <?= htmlspecialchars($collection['name']) ?>
                        </h5>

                        <p class="card-text">
                            <?= htmlspecialchars($collection['description'] ?? '') ?>
                        </p>

                        <p class="mb-1">
                            Owner:
                            <a href="user.php?id=<?= $collection['user_id'] ?>">
                                <?= htmlspecialchars($collection['owner_name']) ?>
                            </a>
                        </p>

                        <p class="mb-1">
                            Items:
                            <?= $collection['item_count'] ?>
                        </p>

                        <p class="text-muted">
                            Updated:
                            <?= htmlspecialchars($collection['updated_at']) ?>
                        </p>

                        <a
                            href="collection.php?id=<?= $collection['id'] ?>"
                            class="btn btn-<?= $theme === 'dark'? 'warning' : 'primary' ?>">
                            View Collection
                        </a>

                    </div>

                </div>

            </div>

        <?php endforeach; ?>

    </div>

    <?php if ($totalPages > 1): ?>

        <nav>
            <ul class="pagination justify-content-center">

                <?php for ($i = 1; $i <= $totalPages; $i++): ?>

                    <li class="page-item <?= $i == $page ? 'active' : '' ?>">
                        <a
                            class="page-link"
                            href="index.php?search=<?= urlencode($search) ?>&page=<?= $i ?>">
                            <?= $i ?>
                        </a>
                    </li>

                <?php endfor; ?>

            </ul>
        </nav>

    <?php endif; ?>

</div>

<?php include 'includes/footer.php'; ?>