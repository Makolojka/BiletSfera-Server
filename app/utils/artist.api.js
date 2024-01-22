/**
 * @swagger
 * tags:
 *   name: Artists
 *   description: API for managing artists.
 */

/**
 * @swagger
 * /api/artists:
 *   get:
 *     summary: Get all artists
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Artist'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/artists/{id}:
 *   get:
 *     summary: Get a single artist by ID
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the artist
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Artist'
 *       404:
 *         description: Artist not found
 */

/**
 * @swagger
 * /api/artist:
 *   post:
 *     summary: Create a single artist
 *     tags: [Artists]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Artist'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Artist'
 */

/**
 * @swagger
 * /api/events/{id}/artists:
 *   get:
 *     summary: Returns artists objects that participate in given event
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Artist'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */