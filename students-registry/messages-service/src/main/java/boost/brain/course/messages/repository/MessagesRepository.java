package boost.brain.course.messages.repository;

import boost.brain.course.common.messages.MessageDto;
import boost.brain.course.messages.repository.entities.MessageEntity;
import org.hibernate.validator.internal.constraintvalidators.bv.EmailValidator;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.*;

@Repository
@Transactional
public class MessagesRepository {

    private final EntityManager entityManager;

    @Autowired
    public MessagesRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }



    public Optional<MessageDto> create(final MessageDto messageDto) {
        if (checkObjectAsNullData(messageDto)) {
            return Optional.empty();
        }
        return Optional.of(getNewCopyingMessageDto(messageDto));
    }

    public Optional<MessageDto> read(final long id) {
        var messageEntity = entityManager.find(MessageEntity.class, id);
        if (checkObjectAsNullData(messageEntity)) {
            return Optional.empty();
        }
        MessageDto result = getResultMessageDto(messageEntity);
        return Optional.of(result);
    }

    public boolean update(final MessageDto messageDto) {
        if (checkObjectAsNullData(messageDto)) {
            return false;
        }
        MessageEntity messageEntity = entityManager.find(MessageEntity.class, messageDto.getId());
        if (checkObjectAsNullData(messageEntity)) {
            return false;
        }
        BeanUtils.copyProperties(
                messageDto, messageEntity, "author", "recipient", "createDate", "readDate", "read");
        entityManager.merge(messageEntity);
        return true;
    }

    public boolean delete(final long id) {
        MessageEntity messageEntity = entityManager.find(MessageEntity.class, id);
        if (checkObjectAsNullData(messageEntity)) {
            return false;
        }
        entityManager.remove(messageEntity);
        return true;
    }

    public Optional <Map<String, List<MessageDto>>> getAllMessageForUser(final String email) {
        Map<String, List<MessageDto>> result = new HashMap<>();
        if (isEmailNotCorrect(email)) {
            return Optional.of(result);
        }

        List<MessageEntity> messageEntities = getMessageEntityListForEmail(email);

        for (MessageEntity messageEntity : messageEntities) {
            String author = messageEntity.getAuthor();
            String recipient = messageEntity.getRecipient();
            if (author.equals(email)) {
                if (!result.containsKey(recipient)) {
                    result.put(recipient, new ArrayList<>());
                }


                MessageDto messageDto = getResultMessageDto(messageEntity);
                result.get(recipient).add(messageDto);
            } else if (recipient.equals(email)) {
                if (!result.containsKey(author)) {
                    result.put(author, new ArrayList<>());
                }
                MessageDto messageDto = getResultMessageDto(messageEntity);
                result.get(author).add(messageDto);
            }
        }
        for (Map.Entry<String, List<MessageDto>> pair : result.entrySet()) {
            pair.getValue().sort((MessageDto m1, MessageDto m2) -> (int) (m1.getCreateDate() - m2.getCreateDate()));
        }
        return Optional.of(result);
    }


    //Проверка на некорректность e-mail
    private boolean isEmailNotCorrect(String email) {
        return StringUtils.isEmpty(email) || !this.checkEmail(email);
    }

    public boolean deleteAllMessagesForUser(final String email) {
        if (StringUtils.isEmpty(email) || !this.checkEmail(email)) {
            return false;
        }
        var messageEntities = getMessageEntityListForEmail(email);

        if (messageEntities == null || messageEntities.isEmpty()) {
            return false;
        }
        for (MessageEntity messageEntity : messageEntities) {
            entityManager.remove(messageEntity);
        }
        return true;
    }

    public boolean messagesAsRead(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return false;
        }
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<MessageEntity> cq = cb.createQuery(MessageEntity.class);
        Root<MessageEntity> from = cq.from(MessageEntity.class);
        Predicate where = from.get("id").in(ids);
        CriteriaQuery<MessageEntity> select = cq.select(from).where(where);
        TypedQuery<MessageEntity> typedQuery = entityManager.createQuery(select);
        List<MessageEntity> messageEntities = typedQuery.getResultList();

        if (messageEntities == null || messageEntities.isEmpty()) {
            return false;
        }
        for (MessageEntity messageEntity : messageEntities) {
            if (!messageEntity.isRead()) {
                messageEntity.setRead(true);
                messageEntity.setReadDate(System.currentTimeMillis());
            }
            entityManager.merge(messageEntity);
        }
        return true;
    }

    public long count() {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        countQuery.select(criteriaBuilder.count(countQuery.from(MessageEntity.class)));
        Long result = entityManager.createQuery(countQuery).getSingleResult();
        return result;
    }

    private List<MessageEntity> getMessageEntityListForEmail(String email) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<MessageEntity> cq = cb.createQuery(MessageEntity.class);
        Root<MessageEntity> from = cq.from(MessageEntity.class);
        List<Predicate> predicateList = new ArrayList<>();
        predicateList.add(cb.equal(from.get("author"), email));
        predicateList.add(cb.equal(from.get("recipient"), email));
        Predicate[] restrictions = new Predicate[predicateList.size()];
        CriteriaQuery<MessageEntity> select = cq.select(from).where(cb.or(predicateList.toArray(restrictions)));
        TypedQuery<MessageEntity> typedQuery = entityManager.createQuery(select);
        return typedQuery.getResultList();
    }

    private boolean checkEmail(final String email) {
        EmailValidator emailValidator = new EmailValidator();
        if (!emailValidator.isValid(email, null)) {
            return false;
        }
        return true;
    }

    private MessageDto getNewCopyingMessageDto(MessageDto messageDto) {
        MessageEntity messageEntity = new MessageEntity();
        BeanUtils.copyProperties(messageDto, messageEntity);
        entityManager.persist(messageEntity);
        MessageDto result = getResultMessageDto(messageEntity);
        return result;
    }


    private MessageDto getResultMessageDto(MessageEntity messageEntity) {
        MessageDto result = new MessageDto();
        BeanUtils.copyProperties(messageEntity, result);
        return result;
    }

    private <T> boolean checkObjectAsNullData(T item) {
        return item == null;
    }

}
