package com.app.security.services;

import com.app.models.*;

import java.util.List;

public interface BoardService {
    Board saveBoard(Board board);
    List<Board> getAllBoards();
    Board getBoardById(Long id);
    Board updateBoard(Long id, Board boardDetails);
    void deleteBoard(Long id);

    List<Board> findAllBoards();

    BoardList addListToBoard(Long boardId, BoardList newList);

    List<BoardList> findListsByBoardId(Long boardId);

    Card addCardToListOfBoard(Long boardId, Long listId, Card newCard);

    void addLabelToCard(Long boardId, Long listId, Long cardId, BoardLabel newLabel);

    BoardList updateBoardListTitle(Long boardId, Long listId, String newTitle);

    Card updateCardDetails(Long boardId, Long listId, Long cardId, Card updatedCardDetails);

    boolean deleteCard(Long boardId, Long listId, Long cardId);

    boolean deleteListByBoardIdAndListId(Long boardId, Long listId);
}
