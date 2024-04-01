package com.app.security.services;

import com.app.models.*;
import com.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class BoardServiceImpl implements BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardListRepository boardListRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private BoardLabelRepository boardLabelRepository;

    @Autowired
    private NoteLabelRepository labelRepository;

    @Override
    public Board saveBoard(Board board) {
        return boardRepository.save(board);
    }

    @Override
    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    @Override
    public Board getBoardById(Long id) {
        return boardRepository.findById(id).orElseThrow(() -> new RuntimeException("Board not found with id: " + id));
    }

    @Override
    public Board updateBoard(Long id, Board boardDetails) {
        Board board = getBoardById(id);
        board.setTitle(boardDetails.getTitle());
        board.setDescription(boardDetails.getDescription());
        board.setIcon(boardDetails.getIcon());
        board.setLastActivity(boardDetails.getLastActivity());
        board.setLists(boardDetails.getLists());
        board.setLabels(boardDetails.getLabels());
        board.setMembers(boardDetails.getMembers());
        return boardRepository.save(board);
    }

    @Override
    public void deleteBoard(Long id) {
        Board board = getBoardById(id);
        boardRepository.delete(board);
    }

    @Override
    public List<Board> findAllBoards() {
        return boardRepository.findAll();
    }

    @Transactional
    public BoardList addListToBoard(Long boardId, BoardList newList) {
        // Fetch the corresponding Board entity
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found with id: " + boardId));

        // Set the boardId on the new BoardList (for direct reference)
        newList.setBoardId(boardId);

        // Add the new BoardList to the Board's list collection
        board.getLists().add(newList);

        // Save the Board entity to cascade changes (assuming CascadeType.ALL is set on the relationship in Board entity)
//        boardRepository.save(board);

        // Alternatively, if you're not cascading persist operations from Board to BoardList, save the newList directly
        return boardListRepository.save(newList);
    }

    @Transactional
    public BoardList updateBoardListTitle(Long boardId, Long listId, String newTitle) {
        // Fetch the corresponding Board entity
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found with id: " + boardId));

        // Find the specific BoardList within the Board entity
        BoardList boardListToUpdate = board.getLists().stream()
                .filter(list -> list.getId().equals(listId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("List not found with id: " + listId));

        // Update the title of the BoardList
        boardListToUpdate.setTitle(newTitle);

        // Save the updated BoardList entity first
        boardListRepository.save(boardListToUpdate);

        // Since we've updated a list within the Board, ensure the Board entity is aware of this change
        // This might involve re-adding the updated list to the Board's collection of lists
        board.getLists().removeIf(list -> list.getId().equals(listId)); // Remove the old instance
        board.getLists().add(boardListToUpdate); // Add the updated instance

        // Save the Board entity to ensure it's up-to-date
        // This step might not be strictly necessary if the Board entity's state is automatically synchronized upon transaction commit
        boardRepository.save(board);

        // Return the updated BoardList
        return boardListToUpdate;
    }


    @Transactional
    public Card updateCardDetails(Long boardId, Long listId, Long cardId, Card updatedCardDetails) {
        // Find the Board
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found with id: " + boardId));

        // Find the BoardList within the Board
        BoardList boardList = board.getLists().stream()
                .filter(list -> list.getId().equals(listId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("List not found with id: " + listId));

        // Find the Card within the BoardList
        Card cardToUpdate = boardList.getCards().stream()
                .filter(card -> card.getId().equals(cardId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Card not found with id: " + cardId));

        // Update the Card with new details
        cardToUpdate.setTitle(updatedCardDetails.getTitle());
        cardToUpdate.setDescription(updatedCardDetails.getDescription());
        cardToUpdate.setDueDate(updatedCardDetails.getDueDate());
        updatedCardDetails.getLabels().forEach(newLabel -> {
            if (!cardToUpdate.getLabels().contains(newLabel)) {
                cardToUpdate.getLabels().add(newLabel);
            }
        });
        // Save the updated Card
        cardRepository.save(cardToUpdate);

        // Manually update the BoardList and Board if necessary
        if (!boardList.getCards().contains(cardToUpdate)) {
            boardList.getCards().add(cardToUpdate);
        }
        boardListRepository.save(boardList);

        if (!board.getLists().contains(boardList)) {
            board.getLists().add(boardList);
        }
        boardRepository.save(board);

        return cardToUpdate;
    }





    @Override
    public List<BoardList> findListsByBoardId(Long boardId) {
        return boardListRepository.findByBoardId(boardId);
    }

    @Transactional
    public Card addCardToListOfBoard(Long boardId, Long listId, Card newCard) {
        // Fetch the BoardList
        BoardList targetList = boardListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("BoardList not found with id: " + listId));

        // Verify the BoardList belongs to the correct Board (optional, based on your business logic)
        if (!targetList.getBoardId().equals(boardId)) {
            throw new RuntimeException("The BoardList does not belong to the specified Board");
        }

        // Create and save the new Card
        newCard.setBoardId(boardId);
        newCard.setListId(listId);
        Card savedCard = cardRepository.save(newCard);

        // Add the Card to the BoardList's card list and save the BoardList
        targetList.getCards().add(savedCard);
        boardListRepository.save(targetList);

        return savedCard;
    }


    @Transactional
    public void addLabelToCard(Long boardId, Long listId, Long cardId, BoardLabel newLabel) {
        // Fetch the Board
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found with id: " + boardId));

        // Fetch the BoardList and verify it belongs to the Board
        BoardList targetList = board.getLists().stream()
                .filter(list -> list.getId().equals(listId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("BoardList not found with id: " + listId));

        // Fetch the Card and verify it belongs to the BoardList
        Card targetCard = targetList.getCards().stream()
                .filter(card -> card.getId().equals(cardId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Card not found with id: " + cardId));

        boardLabelRepository.save(newLabel);

        // Add the label to the Card
        targetCard.getLabels().add(newLabel);

        // Save the updated Card
        cardRepository.save(targetCard);

        // Optionally, save the updated BoardList if needed
        // This might not be necessary if the relationship between BoardList and Card is mapped correctly
        boardListRepository.save(targetList);

        // Add the label to the Board as well
        board.getLabels().add(newLabel);

        // Save the updated Board
        boardRepository.save(board);
    }


    @Transactional
    public boolean deleteCard(Long boardId, Long listId, Long cardId) {
        // Find the Board
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found with id: " + boardId));

        // Find the BoardList within the Board
        BoardList boardList = board.getLists().stream()
                .filter(list -> list.getId().equals(listId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("List not found with id: " + listId));

        // Find the Card within the BoardList
        Card cardToRemove = boardList.getCards().stream()
                .filter(card -> card.getId().equals(cardId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Card not found with id: " + cardId));

        // Retrieve and delete all associated BoardLabel entities
        List<BoardLabel> labelsToRemove = cardToRemove.getLabels();
        if (labelsToRemove != null && !labelsToRemove.isEmpty()) {
            boardLabelRepository.deleteAll(labelsToRemove); // Assuming you have boardLabelRepository defined for BoardLabel entities
            // No need to clear the labels from the card entity as it will be deleted
        }


        // Remove the card from the list
        boardList.getCards().remove(cardToRemove);

        // Optionally, save the updated BoardList if your JPA setup does not auto-flush changes
        // boardListRepository.save(boardList);

        // Delete the card from the repository
        cardRepository.delete(cardToRemove);

        return true;
    }

    @Transactional
    public boolean deleteListByBoardIdAndListId(Long boardId, Long listId) {
        // Find the BoardList by id
        BoardList boardList = boardListRepository.findById(listId).orElse(null);

        if (boardList != null && boardList.getBoardId().equals(boardId)) {
            // Delete the BoardList from the repository
            boardListRepository.deleteById(listId);

            // Load the Board and remove the list from its collection
            Board board = boardRepository.findById(boardId).orElse(null);
            if (board != null) {
                board.getLists().removeIf(list -> list.getId().equals(listId)); // Assuming Board has a getLists() method returning the list of BoardLists
                boardRepository.save(board); // Update the board
                return true; // List deleted successfully
            }
        }

        // List not found or does not belong to the specified board, or board not found
        return false;
    }


}
