const { client } =  require('../middleware/database');

class Messages{
    constructor(message_id, sender_id, recipient_id, content, timestamp){
        this.message_id = message_id;
        this.sender_id = sender_id;
        this.recipient_id = recipient_id;
        this.content = content;
        this.timestamp = timestamp;
    }

    static async sendMessage(senderId, recipientId, content) {
        try {
          const timestamp = new Date(); // Şu anki zamanı al
          const messageId = await this.createMessage(senderId, recipientId, content, timestamp);
          const conversationId = await this.findOrCreateConversation(senderId, recipientId, messageId);
          await this.addMessageToConversation(conversationId, messageId);
          return { success: true, message: "Message sent successfully." };
        } catch (error) {
          console.error("Error sending message: ", error);
          throw new Error("Internal Server Error");
        }
    }
      
    static createMessage = async (senderId, recipientId, content, timestamp) => {
        const messageQuery = `
          INSERT INTO messages (sender_id, recipient_id, content, timestamp)
          VALUES ($1, $2, $3, $4)
          RETURNING message_id
        `;
        const messageValues = [senderId, recipientId, content, timestamp];
        const messageResult = await client.query(messageQuery, messageValues);
        return messageResult.rows[0].message_id;
    };
      
    static findOrCreateConversation = async (userId1, userId2, messageId) => {
        const conversationQuery = `
          SELECT conversation_id
          FROM conversations
          WHERE (user_id_1 = $1 AND user_id_2 = $2) OR (user_id_1 = $2 AND user_id_2 = $1)
        `;
        const conversationValues = [userId1, userId2];
        const conversationResult = await client.query(conversationQuery, conversationValues);
      
        let conversationId;
      
        // Eğer konuşma yoksa yeni bir konuşma oluştur
        if (conversationResult.rows.length === 0) {
          const newConversationQuery = `
            INSERT INTO conversations (user_id_1, user_id_2, last_message_id)
            VALUES ($1, $2, $3)
            RETURNING conversation_id
          `;
          const newConversationValues = [userId1, userId2, messageId];
          const newConversationResult = await client.query(newConversationQuery, newConversationValues);
          conversationId = newConversationResult.rows[0].conversation_id;
        } else {
          conversationId = conversationResult.rows[0].conversation_id;
        }
      
        return conversationId;
    };
      
    static addMessageToConversation = async (conversationId, messageId) => {
        const conversationMessageQuery = `
          INSERT INTO conversations_messages (conversation_id, message_id)
          VALUES ($1, $2)
        `;
        const conversationMessageValues = [conversationId, messageId];
        await client.query(conversationMessageQuery, conversationMessageValues);
    };

      // get all message history 

      
    static getMessagesFromConversation = async (conversationId) => {
        const query = 7`
            SELECT cm.conversation_id, m.content, m.timestamp, 
            CASE 
                WHEN u1.manager_id IS NOT NULL THEN u1.first_name || ' ' || u1.last_name
                WHEN u2.resident_id IS NOT NULL THEN u2.first_name || ' ' || u2.last_name
            END AS sender_name
            FROM conversations_messages cm
            INNER JOIN messages m ON cm.message_id = m.message_id
            LEFT JOIN managers u1 ON m.sender_id = u1.manager_id
            LEFT JOIN residents u2 ON m.sender_id = u2.resident_id
            WHERE cm.conversation_id = $1
            ORDER BY m.timestamp DESC;
        `;
        const values = [conversationId];
        const result = await client.query(query, values);
        return result.rows;
    };
      
    static async getAllMessages(req, res) {
        const { user_id_1, user_id_2 } = req.body;
      
        try {
          const conversationId = await this.getConversationId(user_id_1, user_id_2);
      
          if (!conversationId) {
            res.json([]);
          } else {
            const messages = await this.getMessagesFromConversation(conversationId);
            return messages;
          }
        } catch (error) {
          console.error("Error fetching messages: ", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    static async getConversationId(userId1, userId2) {
        const query = `
          SELECT conversation_id
          FROM conversations
          WHERE (user_id_1 = $1 AND user_id_2 = $2) OR (user_id_1 = $2 AND user_id_2 = $1)
        `;
        const values = [userId1, userId2];
        const result = await client.query(query, values);
        return result.rows.length === 0 ? null : result.rows[0].conversation_id;
    }

      // get message history by user id

      static async getMessagesByUserId(userId) {
        try {
            // Kullanıcının gönderdiği veya aldığı mesajları almak için sorgu
            const query = `
                SELECT *
                FROM messages
                WHERE sender_id = $1 OR recipient_id = $1
                ORDER BY timestamp DESC;
            `;
            const result = await client.query(query, [userId]);
            return result.rows;
        } catch (error) {
            console.error("Error fetching messages by user ID: ", error);
            throw new Error("Internal Server Error");
        }
    }
    
    static async fetchMessages(userId) {
        const query = `
          SELECT
            CASE
              WHEN c.user_id_1 = $1 THEN c.user_id_2
              WHEN c.user_id_2 = $1 THEN c.user_id_1
            END AS contact_id,
            CASE
              WHEN c.user_id_1 = $1 THEN m2.manager_id
              WHEN c.user_id_2 = $1 THEN r2.resident_id
            END AS contact_user_id
          FROM
            conversations c
          JOIN
            managers m1 ON c.user_id_1 = m1.manager_id
          JOIN
            managers m2 ON c.user_id_2 = m2.manager_id
          JOIN
            residents r1 ON c.user_id_1 = r1.resident_id
          JOIN
            residents r2 ON c.user_id_2 = r2.resident_id
          WHERE
            (c.user_id_1 = $1 OR c.user_id_2 = $1) AND
            c.last_message_id IS NOT NULL
          ORDER BY
            c.last_message_id DESC;
        `;
        return await client.query(query, [userId]);
    }
    
    static filterUniqueContacts(messages) {
        const uniqueContacts = [];
        const seenUserIds = new Set();
    
        messages.forEach((message) => {
          if (!seenUserIds.has(message.contact_user_id)) {
            seenUserIds.add(message.contact_user_id);
            uniqueContacts.push(message);
          }
        });
    
        return uniqueContacts;
    }
}

module.exports = { Messages };