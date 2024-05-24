/**
 * @swagger
 * components:
 *   schemas:
 *     Artist:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         image:
 *           type: string
 *         shortDescription:
 *           type: string
 *         career:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the event.
 *         image:
 *           type: string
 *           description: The URL of the event's image.
 *         text:
 *           type: string
 *           description: The main text content of the event.
 *         additionalText:
 *           type: string
 *           description: Additional text content for the event.
 *         organiser:
 *           type: string
 *           description: The name of the event organiser.
 *         date:
 *           type: string
 *           description: The date of the event.
 *         location:
 *           type: string
 *           description: The location of the event.
 *         category:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of event categories.
 *         subCategory:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of event subcategories.
 *         createdAt:
 *           type: string
 *           description: The timestamp when the event was created.
 *         tickets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Ticket'
 *           description: Array of ticket objects associated with the event.
 *         artists:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Artist'
 *           description: Array of artist objects associated with the event.
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who have liked the event.
 *         followers:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who are following the event.
 *         views:
 *           type: integer
 *           description: Number of views for the event.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: The type of the ticket.
 *         price:
 *           type: number
 *           description: The price of the ticket.
 *         dayOfWeek:
 *           type: string
 *           description: The day of the week for the ticket.
 *         date:
 *           type: string
 *           description: The date for the ticket.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The email address of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         role:
 *           type: string
 *           enum:
 *             - admin
 *             - user
 *           description: The role of the user.
 *         active:
 *           type: boolean
 *           description: Indicates whether the user account is active.
 *         isAdmin:
 *           type: boolean
 *           description: Indicates whether the user has admin privileges.
 *         cart:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: The ID of the event in the user's cart.
 *               tickets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ticket:
 *                       type: string
 *                       description: The ID of the ticket in the user's cart.
 *                     quantity:
 *                       type: number
 *                       description: The quantity of the ticket in the user's cart.
 *         likedEvents:
 *           type: array
 *           items:
 *             type: string
 *             description: Array of event IDs that the user has liked.
 *         followedEvents:
 *           type: array
 *           items:
 *             type: string
 *             description: Array of event IDs that the user is following.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Password:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user associated with the password.
 *         password:
 *           type: string
 *           description: The user's password.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user associated with the token.
 *         createDate:
 *           type: number
 *           description: The timestamp when the token was created.
 *         type:
 *           type: string
 *           enum:
 *             - tokenType1
 *             - tokenType2
 *             - tokenType3
 *           description: The type of the token.
 *         value:
 *           type: string
 *           description: The value of the token.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user associated with the transaction.
 *         tickets:
 *           type: array
 *           items:
 *             type: string
 *             description: Reference to the ticket IDs involved in the transaction.
 *         saleDate:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the transaction occurred.
 *         totalCost:
 *           type: number
 *           description: The total cost of the transaction.
 */

