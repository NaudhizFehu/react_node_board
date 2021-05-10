CREATE USER DEV4_06 IDENTIFIED BY DEV4_06;
GRANT CONNECT, RESOURCE TO DEV4_06;
GRANT ALTER SESSION TO DEV4_06;
CONN DEV4_06/DEV4_06;

CREATE SEQUENCE ID_SEQ START WITH 0 INCREMENT BY 1 MAXVALUE 10000 MINVALUE 0 NOCYCLE;
CREATE SEQUENCE ARTICLE_ID_SEQ START WITH 0 INCREMENT BY 1 MAXVALUE 99999999999999 MINVALUE 0 NOCYCLE;

CREATE TABLE MEMBER(
	ID VARCHAR2(500),
	PASSWORD VARCHAR2(16) NOT NULL,
	EMAIL VARCHAR2(40) NOT NULL UNIQUE,
	NAME VARCHAR2(50) NOT NULL,
	BIRTHDAY VARCHAR2(0) NOT NULL,
	PHONENUMBER VARCHAR2(11) NOT NULL UNIQUE,
	ADDRESS1 VARCHAR2(100) NOT NULL,
	ADDRESS2 VARCHAR2(100) NOT NULL,
	ZIPCODE VARCHAR2(100) NOT NULL,
	MANAGER CHAR(1) DEFAULT 0 NOT NULL,
	REGDATE VARCHAR2(10) NOT NULL,
	PATH VARCHAR2(500) NOT NULL,
	CONSTRAINT MEMBER_PK PRIMARY KEY(ID)
);

CREATE TABLE ARTICLE(
	ARTICLE_NO NUMBER NOT NULL,
	TITLE VARCHAR2(100) NOT NULL,
	WRITER_NAME VARCHAR(50) NOT NULL,
	CONTENT CLOB NOT NULL,
	ARTICLE_REGDATE VARCHAR2(10) NOT NULL,
	READ_CNT NUMBER DEFAULT 0 NOT NULL,
	CONSTRAINT ARTICLE_PK PRIMARY KEY(ARTICLE_NO)
);

-- 더미데이터
INSERT INTO ARTICLE VALUES(ARTICLE_ID_SEQ.NEXTVAL, '첫번째 글', '관리자', '냉무', '2021-05-10', 0);
INSERT INTO ARTICLE VALUES(ARTICLE_ID_SEQ.NEXTVAL, '2글', '관리자', '냉~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~무', '2021-05-10', 0);
INSERT INTO ARTICLE VALUES(ARTICLE_ID_SEQ.NEXTVAL, '3글', '관리자', '냉~~~~~~~~~~~~~~~~무', '2021-05-10', 0);
INSERT INTO ARTICLE VALUES(ARTICLE_ID_SEQ.NEXTVAL, '4글', '관리자', '냉~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~무', '2021-05-10', 0);
INSERT INTO ARTICLE VALUES(ARTICLE_ID_SEQ.NEXTVAL, '5글', '관리자', '냉~~무', '2021-05-10', 0);
INSERT INTO ARTICLE VALUES(ARTICLE_ID_SEQ.NEXTVAL, '6글', '관리자', '냉~~~~~~~~~무', '2021-05-10', 0);
INSERT INTO ARTICLE VALUES(ARTICLE_ID_SEQ.NEXTVAL, '777글', '관리자', '냉~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~무', '2021-05-10', 0);
INSERT INTO ARTICLE VALUES(ARTICLE_ID_SEQ.NEXTVAL, '8글', '관리자', '냉~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~무', '2021-05-10', 0);
INSERT INTO ARTICLE VALUES(ARTICLE_ID_SEQ.NEXTVAL, 'GOOGLE', '구글', '냉무', '2021-05-10', 0);
INSERT INTO ARTICLE VALUES(ARTICLE_ID_SEQ.NEXTVAL, '10글', '노노', '냉무', '2021-05-10', 0);
INSERT INTO ARTICLE VALUES(ARTICLE_ID_SEQ.NEXTVAL, '11글', '노노', '냉무', '2021-05-10', 0);
INSERT INTO ARTICLE VALUES(ARTICLE_ID_SEQ.NEXTVAL, '머글', '해리포터', '냉무', '2021-05-10', 0);

-- 테스트용 쿼리
SELECT * FROM ARTICLE WHERE TITLE LIKE '%1%' ORDER BY ARTICLE_NO DESC;