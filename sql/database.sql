CREATE USER DEV4_06 IDENTIFIED BY DEV4_06;
GRANT CONNECT, RESOURCE TO DEV4_06;
GRANT ALTER SESSION TO DEV4_06;
CONN DEV4_06/DEV4_06;

CREATE SEQUENCE IDX_SEQ START WITH 0 INCREMENT BY 1 MAXVALUE 9999999999 MINVALUE 0 NOCYCLE;
CREATE SEQUENCE ARTICLE_ID_SEQ START WITH 0 INCREMENT BY 1 MAXVALUE 99999999999999 MINVALUE 0 NOCYCLE;

CREATE TABLE MEMBER(
	IDX VARCHAR2(10),
	PASSWORD VARCHAR2(16) NOT NULL,
	EMAIL VARCHAR2(40) NOT NULL,
	NAME VARCHAR2(50) NOT NULL,
	BIRTHDAY VARCHAR2(10),
	PHONENUMBER VARCHAR2(11) NOT NULL,
	ADDRESS1 VARCHAR2(100),
	ADDRESS2 VARCHAR2(100),
	ZIPCODE VARCHAR2(100),
	MANAGER CHAR(1) DEFAULT 0 NOT NULL,
	REGDATE VARCHAR2(10) NOT NULL,
	PATH VARCHAR2(500),
	FLATFORM NUMBER(1) NOT NULL, -- 0: 기본 | 1: 네이버 | 2: 카카오
	CONSTRAINT MEMBER_PK PRIMARY KEY(IDX)
);

CREATE TABLE ARTICLE(
	ARTICLE_NO NUMBER NOT NULL,
	TITLE VARCHAR2(100) NOT NULL,
	WRITER_IDX VARCHAR2(10) NOT NULL,
	WRITER_NAME VARCHAR(50) NOT NULL,
	CONTENT CLOB NOT NULL,
	ARTICLE_REGDATE VARCHAR2(10) NOT NULL,
	READ_CNT NUMBER DEFAULT 0 NOT NULL,
	CONSTRAINT ARTICLE_PK PRIMARY KEY(ARTICLE_NO)
);