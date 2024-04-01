package com.app.controllers;

import com.app.models.Board;
import com.app.models.BoardLabel;
import com.app.models.BoardList;
import com.app.models.Card;
import com.app.security.services.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/boards")
@CrossOrigin(origins = "http://localhost:8081")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @PostMapping
    public Board createBoard(@RequestBody Board board) {
        return boardService.saveBoard(board);
    }

    @GetMapping
    public List<Board> getAllBoards() {
        return boardService.getAllBoards();
    }

    @GetMapping("/getBoard")
    public Board getBoardById(@RequestParam Long id) {
        return boardService.getBoardById(id);
    }

    @PutMapping("/{id}")
    public Board updateBoard(@PathVariable Long id, @RequestBody Board boardDetails) {
        return boardService.updateBoard(id, boardDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/member")
    public ResponseEntity<List<Board>> getBoardsByMember(@RequestParam Long memberId) {
        List<Board> allBoards = boardService.findAllBoards();

        List<Board> memberBoards = allBoards.stream()
                .filter(board -> board.getMembers().stream()
                        .anyMatch(member -> member.getMember_id().equals(memberId)))
                .collect(Collectors.toList());

        return ResponseEntity.ok(memberBoards);
    }

    @PostMapping("/addList")
    public BoardList addListToBoard(@RequestParam Long boardId, @RequestBody BoardList newList) {
        return boardService.addListToBoard(boardId, newList);
    }

    @PostMapping("/lists/updateTitle")
    public ResponseEntity<BoardList> updateListTitle(
            @RequestParam("boardId") Long boardId,
            @RequestParam("listId") Long listId,
            @RequestParam("newTitle") String newTitle) {

        BoardList updatedList = boardService.updateBoardListTitle(boardId, listId, newTitle);
        return ResponseEntity.ok(updatedList);
    }

    @PostMapping("/cards/update")
    public ResponseEntity<Card> updateCardDetails(
            @RequestParam("boardId") Long boardId,
            @RequestParam("listId") Long listId,
            @RequestParam("cardId") Long cardId,
            @RequestBody Card card) {

        Card updatedCard = boardService.updateCardDetails(boardId, listId, cardId, card);
        return ResponseEntity.ok(updatedCard);
    }



    @GetMapping("/lists")
    public List<BoardList> getListsByBoardId(@RequestParam Long boardId) {
        return boardService.findListsByBoardId(boardId);
    }


    @PostMapping("/cards/add")
    public ResponseEntity<Card> addCardToListOfBoard(
            @RequestParam("boardId") Long boardId,
            @RequestParam("listId") Long listId,
            @RequestBody Card cardDTO) {

        // Convert CardDTO to Card entity
        Card newCard = new Card();
        newCard.setTitle(cardDTO.getTitle());
        newCard.setDescription(cardDTO.getDescription());
        newCard.setPosition(cardDTO.getPosition());
        newCard.setDueDate(cardDTO.getDueDate());
        // Set other fields as needed from the DTO to the entity

        // Call the service method to add the card
        Card createdCard = boardService.addCardToListOfBoard(boardId, listId, newCard);

        // Return the created card with status 201 (CREATED)
        return new ResponseEntity<>(createdCard, HttpStatus.CREATED);
    }



    @PostMapping("/addLabel")
    public ResponseEntity<?> addLabelToCard(
            @RequestParam("boardId") Long boardId,
            @RequestParam("listId") Long listId,
            @RequestParam("cardId") Long cardId,
            @RequestBody BoardLabel labelDTO) {

        // Convert BoardLabelDTO to BoardLabel
        BoardLabel newLabel = new BoardLabel();
        newLabel.setBoardId(labelDTO.getBoardId());
        newLabel.setId(labelDTO.getId());
        newLabel.setTitle(labelDTO.getTitle());
        // Map other fields if necessary

        // Call the service method to add the label
        boardService.addLabelToCard(boardId, listId, cardId, newLabel);

        // Return a response entity
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cards/delete")
    public ResponseEntity<Boolean> deleteCard(
            @RequestParam("boardId") Long boardId,
            @RequestParam("listId") Long listId,
            @RequestParam("cardId") Long cardId) {

        boolean isDeleted = boardService.deleteCard(boardId, listId, cardId);

        // Return the ResponseEntity with the status of the deletion
        return ResponseEntity.ok(isDeleted);
    }

    @DeleteMapping("/lists/delete")
    public ResponseEntity<Boolean> deleteList(@RequestParam("boardId") Long boardId,
                                              @RequestParam("listId") Long listId) {
        boolean isDeleted = boardService.deleteListByBoardIdAndListId(boardId, listId);
        return ResponseEntity.ok(isDeleted); // Directly return the boolean result
    }

}
