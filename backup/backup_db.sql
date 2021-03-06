PGDMP         "                x            edsixdb1    10.11    10.11 �   �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            �           1262    144468    edsixdb1    DATABASE     �   CREATE DATABASE edsixdb1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_India.1252' LC_CTYPE = 'English_India.1252';
    DROP DATABASE edsixdb1;
             postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
             postgres    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                  postgres    false    3                        3079    12924    plpgsql 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
    DROP EXTENSION plpgsql;
                  false            �           0    0    EXTENSION plpgsql    COMMENT     @   COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
                       false    1            ,           1255    144469    check_skillkit_eligibility()    FUNCTION       CREATE FUNCTION public.check_skillkit_eligibility() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	usercnt integer;
	assessnum integer;
	nextassess integer;
	
    BEGIN
        --
        -- Create a row in emp_audit to reflect the operation performed on emp,
        -- make use of the special variable TG_OP to work out the operation.
        --
        
        IF (TG_OP = 'INSERT') THEN
			usercnt:= (select count(user_id) from skillangels_userfinishcycle where user_id = new.user_id );
			assessnum:= (select isskillkit from skillangels_users where id = new.user_id);
			
			if(usercnt%8 = 0) then
				nextassess:= usercnt/8;
				update skillangels_users set isskillkit = nextassess where id = new.user_id;
			return new;
			end if;
		end if;
		
					return null;

    END;
$$;
 3   DROP FUNCTION public.check_skillkit_eligibility();
       public       postgres    false    3    1            -           1255    144470    cycle_push_restriction()    FUNCTION     �  CREATE FUNCTION public.cycle_push_restriction() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	DECLARE
		ass_status integer;
		totalcnt integer;
	BEGIN
		IF (TG_OP = 'INSERT') THEN						
			totalcnt := (select count(*) from skillangels_games_cylce_entry where 
						 Date(actual_start_date) = Date(new.actual_start_date) and 
						 Date(actual_end_date) = Date(new.actual_end_date) and 
						 user_id = new.user_id and current_year_status=new.current_year_status
						and event_id = new.event_id);
			raise notice 'totalcnt: %', totalcnt;
							if(totalcnt > 0) then
					return null;
				else
					return new;
				end if;
							
		end if;
	END;
$$;
 /   DROP FUNCTION public.cycle_push_restriction();
       public       postgres    false    1    3            q           1255    145726    deletefn(boolean)    FUNCTION     _  CREATE FUNCTION public.deletefn(doenable boolean) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
mytables RECORD;
BEGIN
  FOR mytables IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name
  LOOP
   
      EXECUTE 'Delete from ' || mytables.table_name ;
   
  END LOOP;
 
  RETURN 1;
 
END;
$$;
 1   DROP FUNCTION public.deletefn(doenable boolean);
       public       postgres    false    1    3            H           1255    144471    enter_ass_sess_cycle_score()    FUNCTION     s+  CREATE FUNCTION public.enter_ass_sess_cycle_score() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	dis_cnt integer;
	played_status integer;
    played_end_date1 DATE ;
    end_date DATE ;
    today_date DATE := now();

	todaycnt integer;
    BEGIN
        --
        -- Create a row in emp_audit to reflect the operation performed on emp,
        -- make use of the special variable TG_OP to work out the operation.
        --
    
        IF (TG_OP = 'INSERT') THEN
			IF (new.ass_status_id=2) THEN

					
            dis_cnt:=(select count(distinct game_id) from skillangels_userscore where user_id=new.user_id and ass_status_id=new.ass_status_id and
            current_year_status=new.current_year_status and event_id =new.event_id  and Date(date)>=
            Date( (select actual_start_date from skillangels_games_cylce_entry where user_id =new.user_id  and event_id =new.event_id 
            and current_year_status =new.current_year_status order by actual_start_date desc LIMIT 1)));

            end_date:=(select actual_end_date from skillangels_games_cylce_entry where 
            user_id =new.user_id  and event_id =new.event_id
            and current_year_status =new.current_year_status order by actual_start_date 
            desc LIMIT 1);

            played_status:=(select status from skillangels_games_cylce_entry where 
            user_id =new.user_id  and event_id =new.event_id
            and current_year_status =new.current_year_status order by actual_start_date 
            desc LIMIT 1);
           
			IF (dis_cnt=5)  THEN
					IF (played_status=0) THEN

						INSERT INTO skillangels_userfinishcycle (assess_status_id,user_id,m_score, v_score, f_score, p_score, l_score,
						m_attempt_cnt,v_attempt_cnt,f_attempt_cnt,p_attempt_cnt,l_attempt_cnt,date, current_year_status)

						select NEW.ass_status_id,table2.uid,table2.m_score,table2.v_score,table2.f_score,table2.p_score,table2.l_score,table2.m_att_cnt 
						,table2.v_att_cnt ,table2.f_att_cnt ,table2.p_att_cnt ,table2.l_att_cnt ,(select actual_start_date from skillangels_games_cylce_entry where 
                        user_id =new.user_id  and event_id =new.event_id
                        and current_year_status =new.current_year_status order by actual_start_date 
                        desc LIMIT 1),1
						from
						(SELECT sum(distinct NEW.ass_status_id)as asssstatus,  NEW.user_id as uid, 
						count(CASE WHEN table1.skill_id ='1' THEN table1.skill_id  END )AS m_att_cnt,          
						count(CASE WHEN table1.skill_id ='2' THEN table1.skill_id  END )AS v_att_cnt,
						count(CASE WHEN table1.skill_id ='3' THEN table1.skill_id  END )AS f_att_cnt,
						count( CASE WHEN table1.skill_id ='4' THEN table1.skill_id  END )AS p_att_cnt,      
						count(CASE WHEN table1.skill_id ='5' THEN table1.skill_id  END )AS l_att_cnt,
						sum(CASE WHEN table1.skill_id ='1' THEN table1.score  END) AS m_score,
						sum(CASE WHEN table1.skill_id ='2' THEN table1.score  END) AS v_score,
						sum(CASE WHEN table1.skill_id ='3' THEN table1.score  END) AS f_score,
						sum(CASE WHEN table1.skill_id ='4' THEN table1.score  END) AS p_score,
						sum(CASE WHEN table1.skill_id ='5' THEN table1.score  END) AS l_score
						from (
						select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
						skillangels_userscore where ass_status_id=new.ass_status_id and event_id=new.event_id  and user_id=new.user_id and 
						DATE(date)>=(select actual_start_date from skillangels_games_cylce_entry where 
                        user_id =new.user_id  and event_id =new.event_id
                        and current_year_status =new.current_year_status order by actual_start_date 
                        desc LIMIT 1)
						and current_year_status=new.current_year_status )as table1 ) as table2;

						RETURN NEW;
					

				    ELSIF (played_status=1) THEN
                        played_end_date1:=(select played_end_date from skillangels_games_cylce_entry where 
                        user_id =new.user_id  and event_id =new.event_id
                        and current_year_status =new.current_year_status order by actual_start_date 
                        desc LIMIT 1);			
		

                            IF (Date(end_date) >= Date(today_date)) THEN
                            	UPDATE skillangels_userfinishcycle
                                SET    
                                m_attempt_cnt=  table2.m_att_cnt ,          
                                v_attempt_cnt=  table2.v_att_cnt ,
                                f_attempt_cnt=  table2.f_att_cnt,
                                p_attempt_cnt= table2.p_att_cnt ,      
                                l_attempt_cnt= table2.l_att_cnt,
                                m_score= table2.m_score,
                                v_score= table2.v_score ,
                                f_score= table2.f_score ,
                                p_score=  table2.p_score ,
                                l_score=  table2.l_score 
                                from 
 						        (SELECT   sum(distinct NEW.ass_status_id)as asssstatus,  NEW.user_id as uid, 
                                count(  CASE WHEN table1.skill_id ='1' THEN table1.skill_id  END )AS m_att_cnt,          
                                count(  CASE WHEN table1.skill_id ='2' THEN table1.skill_id  END )AS v_att_cnt,
                                count(  CASE WHEN table1.skill_id ='3' THEN table1.skill_id  END )AS f_att_cnt,
                                count( CASE WHEN table1.skill_id ='4' THEN table1.skill_id  END )AS p_att_cnt,      
                                count( CASE WHEN table1.skill_id ='5' THEN table1.skill_id  END )AS l_att_cnt,
                                sum(  CASE WHEN table1.skill_id ='1' THEN table1.score  END) AS m_score,
                                sum(  CASE WHEN table1.skill_id ='2' THEN table1.score  END) AS v_score,
                                sum(  CASE WHEN table1.skill_id ='3' THEN table1.score  END) AS f_score,
                                sum(  CASE WHEN table1.skill_id ='4' THEN table1.score  END) AS p_score,
                                sum(  CASE WHEN table1.skill_id ='5' THEN table1.score  END) AS l_score
                                from (
                                (select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
                                skillangels_userscore where ass_status_id=new.ass_status_id and event_id=new.event_id  and user_id=new.user_id and 
                                DATE(date)>=(select actual_start_date from skillangels_games_cylce_entry where 
                                user_id =new.user_id  and event_id =new.event_id
                                and current_year_status =new.current_year_status order by actual_start_date 
                                desc LIMIT 1) and current_year_status=new.current_year_status ))as table1 ) as table2
                                WHERE assess_status_id=new.ass_status_id  and user_id=new.user_id and date=(select actual_start_date from skillangels_games_cylce_entry where 
                                user_id =new.user_id  and event_id =new.event_id
                                and current_year_status =new.current_year_status order by actual_start_date 
                                desc LIMIT 1) and current_year_status=1  ;
                                RETURN NEW;                         

                            ELSIF (Date(played_end_date1) = Date(today_date)) THEN
                            	UPDATE skillangels_userfinishcycle
                                SET    
                                m_attempt_cnt=  table2.m_att_cnt ,          
                                v_attempt_cnt=  table2.v_att_cnt ,
                                f_attempt_cnt=  table2.f_att_cnt,
                                p_attempt_cnt= table2.p_att_cnt ,      
                                l_attempt_cnt= table2.l_att_cnt,
                                m_score= table2.m_score,
                                v_score= table2.v_score ,
                                f_score= table2.f_score ,
                                p_score=  table2.p_score ,
                                l_score=  table2.l_score 
                                from 
 						        (SELECT   sum(distinct NEW.ass_status_id)as asssstatus,  NEW.user_id as uid, 
                                count(  CASE WHEN table1.skill_id ='1' THEN table1.skill_id  END )AS m_att_cnt,          
                                count(  CASE WHEN table1.skill_id ='2' THEN table1.skill_id  END )AS v_att_cnt,
                                count(  CASE WHEN table1.skill_id ='3' THEN table1.skill_id  END )AS f_att_cnt,
                                count( CASE WHEN table1.skill_id ='4' THEN table1.skill_id  END )AS p_att_cnt,      
                                count( CASE WHEN table1.skill_id ='5' THEN table1.skill_id  END )AS l_att_cnt,
                                sum(  CASE WHEN table1.skill_id ='1' THEN table1.score  END) AS m_score,
                                sum(  CASE WHEN table1.skill_id ='2' THEN table1.score  END) AS v_score,
                                sum(  CASE WHEN table1.skill_id ='3' THEN table1.score  END) AS f_score,
                                sum(  CASE WHEN table1.skill_id ='4' THEN table1.score  END) AS p_score,
                                sum(  CASE WHEN table1.skill_id ='5' THEN table1.score  END) AS l_score
                                from (
                                (select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
                                skillangels_userscore where ass_status_id=new.ass_status_id and event_id=new.event_id  and user_id=new.user_id and 
                                DATE(date)>=(select actual_start_date from skillangels_games_cylce_entry where 
                                user_id =new.user_id  and event_id =new.event_id
                                and current_year_status =new.current_year_status order by actual_start_date 
                                desc LIMIT 1) and current_year_status=new.current_year_status ))as table1 ) as table2
                                WHERE assess_status_id=new.ass_status_id  and user_id=new.user_id and date=(select actual_start_date from skillangels_games_cylce_entry where 
                                user_id =new.user_id  and event_id =new.event_id
                                and current_year_status =new.current_year_status order by actual_start_date 
                                desc LIMIT 1) and current_year_status=1  ;
                                RETURN NEW;
                            END IF;

                        END IF;
					 END IF;	
			END IF;
            
		END IF;	
	
-- 			RETURN NEW;
		
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$$;
 3   DROP FUNCTION public.enter_ass_sess_cycle_score();
       public       postgres    false    1    3            I           1255    144472    enter_ass_sess_score()    FUNCTION     �  CREATE FUNCTION public.enter_ass_sess_score() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	dis_cnt integer;
	cnt integer;
	todaycnt integer;
    BEGIN
        --
        -- Create a row in emp_audit to reflect the operation performed on emp,
        -- make use of the special variable TG_OP to work out the operation.
        --
    
        IF (TG_OP = 'INSERT') THEN
			IF (new.ass_status_id=2) THEN

					dis_cnt:= (select count(DISTINCT  game_id ) from skillangels_userscore where ass_status_id=new.ass_status_id and event_id=new.event_id  and user_id=new.user_id and DATE(date)=DATE(now()));
					cnt:= (select  count(game_id)  from skillangels_userscore where ass_status_id=new.ass_status_id and event_id=new.event_id  and user_id=new.user_id and DATE(date)=DATE(now()));
					todaycnt:=(select count(* ) from skillangels_userfinishcycle where assess_status_id=new.ass_status_id  and user_id=new.user_id and DATE(date)=DATE(now()) );
		--             INSERT INTO emp_audit SELECT 'I', now(), user, NEW.*;

			IF todaycnt=0  THEN
						IF dis_cnt=5 THEN

							INSERT INTO skillangels_userfinishcycle (assess_status_id,user_id,m_score, v_score, f_score, p_score, l_score,
							m_attempt_cnt,v_attempt_cnt,f_attempt_cnt,p_attempt_cnt,l_attempt_cnt,date)

							select table2.asssstatus,table2.uid,table2.m_score,table2.v_score,table2.f_score,table2.p_score,table2.l_score,table2.m_att_cnt 
							,table2.v_att_cnt ,table2.f_att_cnt ,table2.p_att_cnt ,table2.l_att_cnt ,now()
							from

							(SELECT   sum(distinct NEW.ass_status_id)as asssstatus,  NEW.user_id as uid, 
							count(  CASE WHEN table1.skill_id ='1' THEN table1.skill_id  END )AS m_att_cnt,          
							count(  CASE WHEN table1.skill_id ='2' THEN table1.skill_id  END )AS v_att_cnt,
							count(  CASE WHEN table1.skill_id ='3' THEN table1.skill_id  END )AS f_att_cnt,
							count( CASE WHEN table1.skill_id ='4' THEN table1.skill_id  END )AS p_att_cnt,      
							count( CASE WHEN table1.skill_id ='5' THEN table1.skill_id  END )AS l_att_cnt,
							sum(  CASE WHEN table1.skill_id ='1' THEN table1.score  END) AS m_score,
							sum(  CASE WHEN table1.skill_id ='2' THEN table1.score  END) AS v_score,
							sum(  CASE WHEN table1.skill_id ='3' THEN table1.score  END) AS f_score,
							sum(  CASE WHEN table1.skill_id ='4' THEN table1.score  END) AS p_score,
							sum(  CASE WHEN table1.skill_id ='5' THEN table1.score  END) AS l_score
							from (
							(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
							 skillangels_userscore where ass_status_id=new.ass_status_id and event_id=new.event_id  and user_id=new.user_id and DATE(date)=DATE(now())   ))as table1 ) as table2;

							RETURN NEW;
  						END IF;

				ELSIF todaycnt=1 THEN
 						UPDATE skillangels_userfinishcycle
 						SET    
					m_attempt_cnt=  table2.m_att_cnt ,          
  						v_attempt_cnt=  table2.v_att_cnt ,
 						f_attempt_cnt=  table2.f_att_cnt,
 						p_attempt_cnt= table2.p_att_cnt ,      
						l_attempt_cnt= table2.l_att_cnt,
  						m_score= table2.m_score,
						v_score= table2.v_score ,
  						f_score= table2.f_score ,
  						p_score=  table2.p_score ,
  						l_score=  table2.l_score 
  						from 
 						(SELECT   sum(distinct NEW.ass_status_id)as asssstatus,  NEW.user_id as uid, 
  							count(  CASE WHEN table1.skill_id ='1' THEN table1.skill_id  END )AS m_att_cnt,          
  							count(  CASE WHEN table1.skill_id ='2' THEN table1.skill_id  END )AS v_att_cnt,
  							count(  CASE WHEN table1.skill_id ='3' THEN table1.skill_id  END )AS f_att_cnt,
 							count( CASE WHEN table1.skill_id ='4' THEN table1.skill_id  END )AS p_att_cnt,      
  							count( CASE WHEN table1.skill_id ='5' THEN table1.skill_id  END )AS l_att_cnt,
 							sum(  CASE WHEN table1.skill_id ='1' THEN table1.score  END) AS m_score,
  							sum(  CASE WHEN table1.skill_id ='2' THEN table1.score  END) AS v_score,
 							sum(  CASE WHEN table1.skill_id ='3' THEN table1.score  END) AS f_score,
 							sum(  CASE WHEN table1.skill_id ='4' THEN table1.score  END) AS p_score,
 							sum(  CASE WHEN table1.skill_id ='5' THEN table1.score  END) AS l_score
  							from (
 							(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
 							 skillangels_userscore where ass_status_id=new.ass_status_id and event_id=new.event_id  and user_id=new.user_id and DATE(date)=DATE(now())  ))as table1 ) as table2

  						WHERE assess_status_id=new.ass_status_id  and user_id=new.user_id and DATE(date)=DATE(now())  ;
  						RETURN NEW;
					END IF;	
			END IF;
-- 			RETURN NEW;
		END IF;
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$$;
 -   DROP FUNCTION public.enter_ass_sess_score();
       public       postgres    false    1    3            J           1255    144473    enter_max_ass_cycle_score()    FUNCTION     �)  CREATE FUNCTION public.enter_max_ass_cycle_score() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
dis_cnt integer;
played_status integer;
played_end_date1 DATE ;
end_date DATE ;
act_start_cnt integer ;
today_date DATE := now();
    BEGIN
        --
        -- Create a row in emp_audit to reflect the operation performed on emp,
        -- make use of the special variable TG_OP to work out the operation.
        --
    
        IF (TG_OP = 'INSERT') THEN
        	IF (new.ass_status_id=2) THEN
                dis_cnt:=(select count(distinct game_id) from skillangels_userscore where user_id=new.user_id and ass_status_id=new.ass_status_id and
                current_year_status=new.current_year_status and event_id =new.event_id  and Date(date)>=
                Date( (select actual_start_date from skillangels_games_cylce_entry where user_id =new.user_id  and event_id =new.event_id 
                and current_year_status =new.current_year_status order by actual_start_date desc LIMIT 1)));

                act_start_cnt:=(select count(date) from skillangels_usermaxscore where  user_id =new.user_id 
                and current_year_status =new.current_year_status and date= (select actual_start_date from skillangels_games_cylce_entry where 
                user_id =new.user_id  and event_id =new.event_id
                and current_year_status =new.current_year_status order by actual_start_date 
                desc LIMIT 1));

                end_date:=(select actual_end_date from skillangels_games_cylce_entry where 
                user_id =new.user_id  and event_id =new.event_id
                and current_year_status =new.current_year_status order by actual_start_date 
                desc LIMIT 1);

                played_status:=(select status from skillangels_games_cylce_entry where 
                user_id =new.user_id  and event_id =new.event_id
                and current_year_status =new.current_year_status order by actual_start_date 
                desc LIMIT 1);

                IF (dis_cnt=5)  THEN
                        IF (act_start_cnt=0) THEN

                                INSERT INTO skillangels_usermaxscore (assess_status_id,user_id,max_m_score, max_v_score,
                                                                    max_f_score, max_p_score,
                                                                    max_l_score,date, current_year_status)

                                select table2.asssstatus,table2.uid,table2.m_score,table2.v_score,table2.f_score,table2.p_score,table2.l_score,(select actual_start_date from skillangels_games_cylce_entry where 
                                user_id =new.user_id  and event_id =new.event_id
                                and current_year_status =new.current_year_status order by actual_start_date 
                                desc LIMIT 1),1
                                from
                                (SELECT   sum(distinct NEW.ass_status_id)as asssstatus,  NEW.user_id as uid, 
                                sum(  CASE WHEN table1.skill_id ='1' THEN table1.score  END) AS m_score,
                                sum(  CASE WHEN table1.skill_id ='2' THEN table1.score  END) AS v_score,
                                sum(  CASE WHEN table1.skill_id ='3' THEN table1.score  END) AS f_score,
                                sum(  CASE WHEN table1.skill_id ='4' THEN table1.score  END) AS p_score,
                                sum(  CASE WHEN table1.skill_id ='5' THEN table1.score  END) AS l_score
                                from (
                                (select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
                                skillangels_userscore where ass_status_id=new.ass_status_id and event_id=new.event_id  and user_id=new.user_id and 
                                DATE(date)>=(select actual_start_date from skillangels_games_cylce_entry where 
                                user_id =new.user_id  and event_id =new.event_id
                                and current_year_status =new.current_year_status order by actual_start_date 
                                desc LIMIT 1) and current_year_status=new.current_year_status ))as table1 ) as table2;
                                RETURN NEW;
                       

                        ELSIF (act_start_cnt=1) THEN
                            played_end_date1:=(select played_end_date from skillangels_games_cylce_entry where 
                            user_id =new.user_id  and event_id =new.event_id
                            and current_year_status =new.current_year_status order by actual_start_date 
                            desc LIMIT 1);			

                            IF (Date(end_date) >= Date(today_date)) THEN
                                    UPDATE skillangels_usermaxscore
                                    SET    
                                    max_m_score= table3.m_score,
                                    max_v_score= table3.v_score ,
                                    max_f_score= table3.f_score ,
                                    max_p_score= table3.p_score ,
                                    max_l_score= table3.l_score 
                                    from 
                                    (SELECT      							
                                        sum(  CASE WHEN table1.skill_id ='1' THEN table1.score  END) AS m_score,
                                        sum(  CASE WHEN table1.skill_id ='2' THEN table1.score  END) AS v_score,
                                        sum(  CASE WHEN table1.skill_id ='3' THEN table1.score  END) AS f_score,
                                        sum(  CASE WHEN table1.skill_id ='4' THEN table1.score  END) AS p_score,
                                        sum(  CASE WHEN table1.skill_id ='5' THEN table1.score  END) AS l_score
                                        from 
                                        (select max(score) as score,skill_id from
                                        (select game_id ,score ,ass_status_id, user_id,date,(select skill_id from getskill(game_id) 
                                        as t(game_id int,skill_id int)) from 
                                        skillangels_userscore where ass_status_id=new.ass_status_id
                                        and event_id=new.event_id  and user_id=new.user_id and 
                                        DATE(date)>=(select actual_start_date from skillangels_games_cylce_entry where 
                                        user_id =new.user_id  and event_id =new.event_id
                                        and current_year_status =new.current_year_status order by actual_start_date 
                                        desc LIMIT 1) and 
                                        current_year_status=new.current_year_status )as table2
                                        group by skill_id) as table1) as table3
                                        WHERE assess_status_id=new.ass_status_id  and user_id=new.user_id and date=(select actual_start_date from skillangels_games_cylce_entry where 
                                        user_id =new.user_id  and event_id =new.event_id
                                        and current_year_status =new.current_year_status order by actual_start_date 
                                        desc LIMIT 1) and current_year_status=1  ;
                                    RETURN NEW;
                                
                                ELSIF (Date(played_end_date1) = Date(today_date)) THEN
                                    UPDATE skillangels_usermaxscore
                                    SET    
                                    max_m_score= table3.m_score,
                                    max_v_score= table3.v_score ,
                                    max_f_score= table3.f_score ,
                                    max_p_score= table3.p_score ,
                                    max_l_score= table3.l_score 
                                    from 
                                    (SELECT      							
                                        sum(  CASE WHEN table1.skill_id ='1' THEN table1.score  END) AS m_score,
                                        sum(  CASE WHEN table1.skill_id ='2' THEN table1.score  END) AS v_score,
                                        sum(  CASE WHEN table1.skill_id ='3' THEN table1.score  END) AS f_score,
                                        sum(  CASE WHEN table1.skill_id ='4' THEN table1.score  END) AS p_score,
                                        sum(  CASE WHEN table1.skill_id ='5' THEN table1.score  END) AS l_score
                                        from 
                                        (select max(score) as score,skill_id from
                                        (select game_id ,score ,ass_status_id, user_id,date,(select skill_id from getskill(game_id) 
                                        as t(game_id int,skill_id int)) from 
                                        skillangels_userscore where ass_status_id=new.ass_status_id
                                        and event_id=new.event_id  and user_id=new.user_id and 
                                        DATE(date)>=(select actual_start_date from skillangels_games_cylce_entry where 
                                        user_id =new.user_id  and event_id =new.event_id
                                        and current_year_status =new.current_year_status order by actual_start_date 
                                        desc LIMIT 1) and 
                                        current_year_status=new.current_year_status )as table2
                                        group by skill_id) as table1) as table3
                                        WHERE assess_status_id=new.ass_status_id  and user_id=new.user_id and date=(select actual_start_date from skillangels_games_cylce_entry where 
                                        user_id =new.user_id  and event_id =new.event_id
                                        and current_year_status =new.current_year_status order by actual_start_date 
                                        desc LIMIT 1) and current_year_status=1  ;
                                    RETURN NEW;
                                END IF;
							END IF;
					 END IF;	
			END IF;
            
		END IF;	  
			      
-- 			RETURN NEW;
		
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$$;
 2   DROP FUNCTION public.enter_max_ass_cycle_score();
       public       postgres    false    3    1            K           1255    144474    enter_skillkitgames_cylce()    FUNCTION     r  CREATE FUNCTION public.enter_skillkitgames_cylce() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	dis_cnt integer;
	played_status integer;
	skill_cnt integer;
    BEGIN
        --
        -- Create a row in emp_audit to reflect the operation performed on emp,
        -- make use of the special variable TG_OP to work out the operation.
        --
    
        IF (TG_OP = 'INSERT') THEN
			dis_cnt:=(select count(distinct game_id) from skillangels_skillkitscore where user_id=new.user_id and 
			current_year_status=new.current_year_status and event_id =new.event_id  and Date(played_date)>=
			Date( (select actual_start_date from skillangels_skillkitgames_cylce_entry where user_id =new.user_id  and event_id =new.event_id 
			and current_year_status =new.current_year_status order by actual_start_date desc LIMIT 1)));
           
		    skill_cnt:=(select skillcnt from skillangels_skillkitgames_cylce_entry where user_id=new.user_id and 
			current_year_status=new.current_year_status and event_id =new.event_id  and Date(actual_start_date)=
			Date( (select actual_start_date from skillangels_skillkitgames_cylce_entry where user_id =new.user_id  and event_id =new.event_id 
			and current_year_status =new.current_year_status order by actual_start_date desc LIMIT 1)));
		
		    played_status:=(select status from skillangels_skillkitgames_cylce_entry where 
			user_id =new.user_id  and event_id =new.event_id
			and current_year_status =new.current_year_status order by actual_start_date 
			desc LIMIT 1);
			
			IF (played_status=0) THEN
				IF (dis_cnt=skill_cnt) THEN
					update skillangels_skillkitgames_cylce_entry set status =1,played_end_date=DATE(now()) where 
					 current_year_status=new.current_year_status
					and user_id=NEW.user_id  and 
					actual_start_date=(select actual_start_date from skillangels_skillkitgames_cylce_entry where 
					user_id =NEW.user_id   and current_year_status =new.current_year_status order by actual_start_date 
					desc LIMIT 1);
					RETURN NEW;
				END IF;	
		END IF;	
		
		END IF;	
	
-- 			RETURN NEW;
		
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$$;
 2   DROP FUNCTION public.enter_skillkitgames_cylce();
       public       postgres    false    1    3            p           1255    145725    fn_triggerall(boolean)    FUNCTION     �  CREATE FUNCTION public.fn_triggerall(doenable boolean) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
mytables RECORD;
BEGIN
  FOR mytables IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name
  LOOP
    IF DoEnable THEN
      EXECUTE 'ALTER TABLE ' || mytables.table_name || ' ENABLE TRIGGER ALL';
    ELSE
      EXECUTE 'ALTER TABLE ' || mytables.table_name || ' DISABLE TRIGGER ALL';
    END IF; 
  END LOOP;
 
  RETURN 1;
 
END;
$$;
 6   DROP FUNCTION public.fn_triggerall(doenable boolean);
       public       postgres    false    3    1            L           1255    144475 &   gameassessmentwisescore(text, integer)    FUNCTION     �  CREATE FUNCTION public.gameassessmentwisescore(userid text, eventid integer) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $$
declare 
result RECORD;
len float;
len1 float;
len2 float;
len3 float;
id_array text ARRAY;
id_array1 text ARRAY;

incr integer;
incr1 integer;
arr_len integer;
BEGIN

-- len=CEIL((SELECT CAST ((select count(cycle_id) from skillangels_userfinishcycle where user_id=userid) AS FLOAT)/8));
len1 := (select count(ass_status_id) from skillangels_userscore where ass_status_id=1 and user_id =userid);
len2 :=CEIL((SELECT CAST ((select count(assess_status_id) from skillangels_userfinishcycle WHERE  user_id=userid  ) AS FLOAT)/8));
len3 := (select count(ass_status_id) from skillangels_userscore where ass_status_id=3 and user_id =userid);

BEGIN
IF len1=1 and len2>0 and len3=1 THEN 
len:= len1+len2+len3;
ELSEIF len1=1 and len2>0 THEN
len:= len1+len2;
ELSE 
len:= len1;
END IF;
END;

 BEGIN
  	IF len1>0 then
 					SELECT  sum(distinct ass_status_id ),
 					sum(CASE WHEN table1.skill_id ='1' and  table1.score IS NOT NULL THEN  table1.score ELSE 0 END) AS m_score,
 					sum(CASE WHEN table1.skill_id ='2' and  table1.score IS NOT NULL THEN table1.score  ELSE 0  END) AS v_score,
 					sum(CASE WHEN table1.skill_id ='3' and  table1.score IS NOT NULL THEN  table1.score ELSE 0   END) AS f_score,
 					sum(CASE WHEN table1.skill_id ='4' and  table1.score IS NOT NULL THEN  table1.score  ELSE 0   END) AS p_score,
 					sum(CASE WHEN table1.skill_id ='5' and  table1.score IS NOT NULL THEN  table1.score  ELSE 0    END) AS l_score,
					null AS  avg_m_score ,
					null AS  avg_v_score ,
					null AS  avg_f_score ,
					null AS  avg_p_score ,
					null AS  avg_l_score ,
					null AS  bspi_avg 
					
 					from 
 					(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
 					skillangels_userscore where ass_status_id=1 and event_id=eventid  and user_id=userid  )as table1 into result;
  	return next result;
 	END IF;
 	END;
	
 	BEGIN
 	IF len3>0 then
 					SELECT sum(distinct ass_status_id ),
 					sum(CASE WHEN table1.skill_id ='1' and  table1.score IS NOT NULL THEN  table1.score ELSE 0  END) AS m_score,
 					sum(CASE WHEN table1.skill_id ='2' and  table1.score IS NOT NULL THEN  table1.score ELSE 0   END) AS v_score,
 					sum(CASE WHEN table1.skill_id ='3' and  table1.score IS NOT NULL THEN  table1.score ELSE 0  END) AS f_score,
 					sum(CASE WHEN table1.skill_id ='4' and  table1.score IS NOT NULL THEN  table1.score ELSE 0  END) AS p_score,
 					sum(CASE WHEN table1.skill_id ='5' and  table1.score IS NOT NULL THEN  table1.score ELSE 0 END)AS l_score,
					null AS  avg_m_score ,
					null AS  avg_v_score ,
					null AS  avg_f_score ,
					null AS  avg_p_score ,
					null AS  avg_l_score ,
					null AS  bspi_avg 
					
 					from 
 					(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
 					skillangels_userscore where ass_status_id=3 and event_id=eventid  and user_id=userid  )as table1 into result;
 	return next result;
 	END IF;
 	END;
	
	BEGIN
	IF len2>0 then
	id_array:=(select array(select ufc_id from skillangels_userfinishcycle where assess_status_id=2 and user_id =userid order by ufc_id)) ;
	arr_len:=array_length(id_array, 1);
	incr:=1;
	incr1:=8;
	id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
		for counter in 1..len2
			loop
			BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
			For result in 
					select sum(distinct assess_status_id)as ass_status_id ,
					sum(m_score) as m_score,
					sum(v_score) as v_score,
					sum(f_score) as f_score,
					sum(p_score) as p_score,
					sum(l_score) as l_score,
					CAST ((sum(m_score/m_attempt_cnt))/count(m_score) as text) as avg_m_score,
					CAST ((sum(v_score/v_attempt_cnt))/count(v_score)as text) as avg_v_score,
					CAST ((sum(f_score/f_attempt_cnt))/count(f_score) as text)as avg_f_score, 
					CAST ((sum(p_score/p_attempt_cnt))/count(p_score) as text)as avg_p_score,
					CAST ((sum(l_score/l_attempt_cnt))/count(l_score) as text) as avg_l_score,
					CAST ((((sum(m_score/m_attempt_cnt))/count(m_score)+(sum(v_score/v_attempt_cnt))/count(v_score)+(sum(f_score/f_attempt_cnt))/count(f_score)+
					(sum(p_score/p_attempt_cnt))/count(p_score)+(sum(l_score/l_attempt_cnt))/count(l_score))/5)as text) as bspi_avg
					from skillangels_userfinishcycle 
					where user_id=userid and ufc_id = any(id_array1)
					GROUP BY assess_status_id
					
			loop
				incr := incr+8;
				incr1 := incr1+8;
				id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
				BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
				counter:=counter+1;
			end loop;
			return next result;
		end loop;		
 	END IF;
	END;

END
$$;
 L   DROP FUNCTION public.gameassessmentwisescore(userid text, eventid integer);
       public       postgres    false    1    3            O           1255    144476 /   gameassessmentwisescore(text, integer, integer)    FUNCTION     �  CREATE FUNCTION public.gameassessmentwisescore(userid text, eventid integer, year_status integer) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $$
declare 
result RECORD;
len float;
len1 float;
len2 float;
len3 float;
id_array text ARRAY;
id_array1 text ARRAY;

incr integer;
incr1 integer;
arr_len integer;
BEGIN

-- len=CEIL((SELECT CAST ((select count(cycle_id) from skillangels_userfinishcycle where user_id=userid) AS FLOAT)/8));
len1 := (select count(ass_status_id) from skillangels_userscore where ass_status_id=1 and user_id =userid  and current_year_status=year_status);
len2 :=CEIL((SELECT CAST ((select count(assess_status_id) from skillangels_userfinishcycle WHERE  user_id=userid  and current_year_status=year_status ) AS FLOAT)/8));
len3 := (select count(ass_status_id) from skillangels_userscore where ass_status_id=3 and user_id =userid  and current_year_status=year_status);

BEGIN
IF len1=1 and len2>0 and len3=1 THEN 
len:= len1+len2+len3;
ELSEIF len1=1 and len2>0 THEN
len:= len1+len2;
ELSE 
len:= len1;
END IF;
END;

 BEGIN
  	IF len1>0 then
 					SELECT  sum(distinct ass_status_id ),
 					sum(CASE WHEN table1.skill_id ='1' and  table1.score IS NOT NULL THEN  table1.score ELSE 0 END) AS m_score,
 					sum(CASE WHEN table1.skill_id ='2' and  table1.score IS NOT NULL THEN table1.score  ELSE 0  END) AS v_score,
 					sum(CASE WHEN table1.skill_id ='3' and  table1.score IS NOT NULL THEN  table1.score ELSE 0   END) AS f_score,
 					sum(CASE WHEN table1.skill_id ='4' and  table1.score IS NOT NULL THEN  table1.score  ELSE 0   END) AS p_score,
 					sum(CASE WHEN table1.skill_id ='5' and  table1.score IS NOT NULL THEN  table1.score  ELSE 0    END) AS l_score,
					null AS  avg_m_score ,
					null AS  avg_v_score ,
					null AS  avg_f_score ,
					null AS  avg_p_score ,
					null AS  avg_l_score ,
					null AS  bspi_avg 
					
 					from 
 					(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
 					skillangels_userscore where ass_status_id=1 and event_id=eventid  and user_id=userid  and current_year_status=year_status  )as table1 into result;
  	return next result;
 	END IF;
 	END;
	
 	BEGIN
 	IF len3>0 then
 					SELECT sum(distinct ass_status_id ),
 					sum(CASE WHEN table1.skill_id ='1' and  table1.score IS NOT NULL THEN  table1.score ELSE 0  END) AS m_score,
 					sum(CASE WHEN table1.skill_id ='2' and  table1.score IS NOT NULL THEN  table1.score ELSE 0   END) AS v_score,
 					sum(CASE WHEN table1.skill_id ='3' and  table1.score IS NOT NULL THEN  table1.score ELSE 0  END) AS f_score,
 					sum(CASE WHEN table1.skill_id ='4' and  table1.score IS NOT NULL THEN  table1.score ELSE 0  END) AS p_score,
 					sum(CASE WHEN table1.skill_id ='5' and  table1.score IS NOT NULL THEN  table1.score ELSE 0 END)AS l_score,
					null AS  avg_m_score ,
					null AS  avg_v_score ,
					null AS  avg_f_score ,
					null AS  avg_p_score ,
					null AS  avg_l_score ,
					null AS  bspi_avg 
					
 					from 
 					(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
 					skillangels_userscore where ass_status_id=3 and event_id=eventid  and user_id=userid  and current_year_status=year_status )as table1 into result;
 	return next result;
 	END IF;
 	END;
	
	BEGIN
	IF len2>0 then
	id_array:=(select array(select ufc_id from skillangels_userfinishcycle where assess_status_id=2 and user_id =userid order by date)) ;
	arr_len:=array_length(id_array, 1);
	incr:=1;
	incr1:=8;
	id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
		for counter in 1..len2
			loop
			BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
			For result in 
					select sum(distinct assess_status_id)as ass_status_id ,
					sum(m_score) as m_score,
					sum(v_score) as v_score,
					sum(f_score) as f_score,
					sum(p_score) as p_score,
					sum(l_score) as l_score,
					CAST ((sum(m_score/m_attempt_cnt))/count(m_score) as text) as avg_m_score,
					CAST ((sum(v_score/v_attempt_cnt))/count(v_score)as text) as avg_v_score,
					CAST ((sum(f_score/f_attempt_cnt))/count(f_score) as text)as avg_f_score, 
					CAST ((sum(p_score/p_attempt_cnt))/count(p_score) as text)as avg_p_score,
					CAST ((sum(l_score/l_attempt_cnt))/count(l_score) as text) as avg_l_score,
					CAST ((((sum(m_score/m_attempt_cnt))/count(m_score)+(sum(v_score/v_attempt_cnt))/count(v_score)+(sum(f_score/f_attempt_cnt))/count(f_score)+
					(sum(p_score/p_attempt_cnt))/count(p_score)+(sum(l_score/l_attempt_cnt))/count(l_score))/5)as text) as bspi_avg
					from skillangels_userfinishcycle 
					where user_id=userid and current_year_status=year_status and ufc_id = any(id_array1)
					GROUP BY assess_status_id
					
			loop
				incr := incr+8;
				incr1 := incr1+8;
				id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
				BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
				counter:=counter+1;
			end loop;
			return next result;
		end loop;		
 	END IF;
	END;

END
$$;
 a   DROP FUNCTION public.gameassessmentwisescore(userid text, eventid integer, year_status integer);
       public       postgres    false    1    3            P           1255    144477 8   gameassessmentwisescore_maxbased(text, integer, integer)    FUNCTION     �  CREATE FUNCTION public.gameassessmentwisescore_maxbased(userid text, eventid integer, year_status integer) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $$
declare 
result RECORD;
len float;
len1 float;
len2 float;
len3 float;
id_array text ARRAY;
id_array1 text ARRAY;

incr integer;
incr1 integer;
arr_len integer;
BEGIN

len1 := (select count(ass_status_id) from skillangels_userscore where ass_status_id=1 and user_id =userid  and current_year_status=year_status);
len2 :=CEIL((SELECT CAST ((select count(assess_status_id) from skillangels_usermaxscore WHERE  user_id=userid  and current_year_status=year_status ) AS FLOAT)/8));
len3 := (select count(ass_status_id) from skillangels_userscore where ass_status_id=3 and user_id =userid  and current_year_status=year_status);

BEGIN
IF len1=1 and len2>0 and len3=1 THEN 
len:= len1+len2+len3;
ELSEIF len1=1 and len2>0 THEN
len:= len1+len2;
ELSE 
len:= len1;
END IF;
END;
BEGIN
  	IF len1>0 then
 					SELECT  sum(distinct ass_status_id ),
 					sum(CASE WHEN table1.skill_id ='1' and  table1.score IS NOT NULL THEN  table1.score ELSE 0 END) AS m_score,
 					sum(CASE WHEN table1.skill_id ='2' and  table1.score IS NOT NULL THEN table1.score  ELSE 0 END) AS v_score,
 					sum(CASE WHEN table1.skill_id ='3' and  table1.score IS NOT NULL THEN  table1.score ELSE 0 END) AS f_score,
 					sum(CASE WHEN table1.skill_id ='4' and  table1.score IS NOT NULL THEN  table1.score ELSE 0 END) AS p_score,
 					sum(CASE WHEN table1.skill_id ='5' and  table1.score IS NOT NULL THEN  table1.score ELSE 0 END) AS l_score,
					null AS  avg_m_score ,
					null AS  avg_v_score ,
					null AS  avg_f_score ,
					null AS  avg_p_score ,
					null AS  avg_l_score ,
					null AS  bspi_avg 	 				
 					from 
 					(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
 					skillangels_userscore where ass_status_id=1 and event_id=eventid  and user_id=userid  and current_year_status=year_status  )as table1 into result;
  	return next result;
 	END IF;
 	END;	
 	BEGIN
 	IF len3>0 then
 					SELECT sum(distinct ass_status_id ),
 					sum(CASE WHEN table1.skill_id ='1' and  table1.score IS NOT NULL THEN  table1.score ELSE 0 END) AS m_score,
 					sum(CASE WHEN table1.skill_id ='2' and  table1.score IS NOT NULL THEN  table1.score ELSE 0 END) AS v_score,
 					sum(CASE WHEN table1.skill_id ='3' and  table1.score IS NOT NULL THEN  table1.score ELSE 0 END) AS f_score,
 					sum(CASE WHEN table1.skill_id ='4' and  table1.score IS NOT NULL THEN  table1.score ELSE 0 END) AS p_score,
 					sum(CASE WHEN table1.skill_id ='5' and  table1.score IS NOT NULL THEN  table1.score ELSE 0 END) AS l_score,
					null AS  avg_m_score ,
					null AS  avg_v_score ,
					null AS  avg_f_score ,
					null AS  avg_p_score ,
					null AS  avg_l_score ,
					null  AS  bspi_avg 					
 					from 
 					(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
 					skillangels_userscore where ass_status_id=3 and event_id=eventid  and user_id=userid  and current_year_status=year_status )as table1 into result;
 	return next result;
 	END IF;
 	END;	
	BEGIN
	IF len2>0 then
	id_array:=(select array(select ums_id from skillangels_usermaxscore where assess_status_id=2 and user_id =userid order by date)) ;
	arr_len:=array_length(id_array, 1);
	incr:=1;
	incr1:=8;
	id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
		for counter in 1..len2
			loop
			BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
			For result in 
					select sum(distinct assess_status_id)as ass_status_id ,
					sum(max_m_score) as m_score,
					sum(max_v_score) as v_score,
					sum(max_f_score) as f_score,
					sum(max_p_score) as p_score,
					sum(max_l_score) as l_score,
					CAST (Round((((sum(max_m_score)))/ (count(max_m_score)*1.0))) as text) as avg_m_score,
					CAST (Round((((sum(max_v_score)))/ (count(max_v_score)*1.0))) as text) as avg_v_score,
					CAST (Round((((sum(max_f_score)))/ (count(max_f_score)*1.0))) as text)as avg_f_score, 
					CAST (Round((((sum(max_p_score)))/ (count(max_p_score)*1.0))) as text)as avg_p_score,
					CAST (Round((((sum(max_l_score)))/ (count(max_l_score)*1.0))) as text) as avg_l_score,
					CAST (ROUND(((ROUND((sum(max_m_score)),2)/count(max_m_score)+(ROUND(sum(max_v_score),2))/count(max_v_score)+(ROUND(sum(max_f_score),2))/count(max_f_score)+
					(ROUND(sum(max_p_score),2))/count(max_p_score)+(ROUND(sum(max_l_score),2))/count(max_l_score))/5),2)as text) as bspi_avg
					from skillangels_usermaxscore 
					where user_id=userid and current_year_status=year_status and ums_id = any(id_array1)
					GROUP BY assess_status_id					
			loop
				incr := incr+8;
				incr1 := incr1+8;
				id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
				BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
				counter:=counter+1;
			end loop;
			return next result;
		end loop;		
 	END IF;
	END;

END
$$;
 j   DROP FUNCTION public.gameassessmentwisescore_maxbased(userid text, eventid integer, year_status integer);
       public       postgres    false    3    1            Q           1255    144478    gameasswisestar(text, integer)    FUNCTION     �3  CREATE FUNCTION public.gameasswisestar(userid text, eid integer) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $$
declare 
result RECORD;
len float;
len1 float;
len2 float;
len3 float;
id_array text ARRAY;
id_array1 text ARRAY;

incr integer;
incr1 integer;
arr_len integer;
BEGIN

-- len=CEIL((SELECT CAST ((select count(cycle_id) from skillangels_userfinishcycle where user_id=userid) AS FLOAT)/8));
len1 := (select count(ass_status_id) from skillangels_userscore where ass_status_id=1 and user_id =userid and event_id=eid);
len2 :=CEIL((SELECT CAST ((select count(assess_status_id) from skillangels_userfinishcycle WHERE  user_id=userid  ) AS FLOAT)/8));
len3 := (select count(ass_status_id) from skillangels_userscore where ass_status_id=3 and user_id =userid and event_id=eid);

BEGIN
IF len1=1 and len2>0 and len3=1 THEN 
len:= len1+len2+len3;
ELSEIF len1=1 and len2>0 THEN
len:= len1+len2;
ELSE 
len:= len1;
END IF;
END;

 BEGIN
  	IF len1>0 then
 					SELECT  sum(distinct ass_status_id ),
 									sum(CASE
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 90 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 100 THEN 5
		   ELSE 0
        END)*8 as ass_m_starcnt,
		sum( CASE
		    WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 90 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_v_starcnt,
		sum(CASE
		    WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_f_starcnt,
		sum(CASE
		  WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_p_starcnt,
		sum(CASE
		  WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_l_starcnt
					from 
 					(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
 					skillangels_userscore where ass_status_id=1 and event_id=eid  and user_id=userid  )as table1 into result;
  	return next result;
 	END IF;
 	END;
	
 	BEGIN
 	IF len3>0 then
 					SELECT  sum(distinct ass_status_id ),
 									sum(CASE
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 90 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 100 THEN 5
		   ELSE 0
        END)*8 as ass_m_starcnt,
		sum( CASE
		    WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 90 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_v_starcnt,
		sum(CASE
		    WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_f_starcnt,
		sum(CASE
		  WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_p_starcnt,
		sum(CASE
		  WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_l_starcnt
 					from 
 					(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
 					skillangels_userscore where ass_status_id=3 and event_id=eid  and user_id=userid  )as table1 into result;
 	return next result;
 	END IF;
 	END;
	
	BEGIN
	IF len2>0 then
	id_array:=(select array(select ufc_id from skillangels_userfinishcycle where assess_status_id=2 and user_id =userid order by ufc_id)) ;
	arr_len:=array_length(id_array, 1);
	incr:=1;
	incr1:=8;
	id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
		for counter in 1..len2
			loop
			BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
			For result in 
					select  sum(distinct assess_status_id)as ass_status_id ,
					sum(CASE
           WHEN (m_score/m_attempt_cnt) >= 20 AND (m_score/m_attempt_cnt) <= 40 THEN 1
           WHEN (m_score/m_attempt_cnt) > 40 AND (m_score/m_attempt_cnt) <= 60 THEN 2
           WHEN (m_score/m_attempt_cnt) > 60 AND (m_score/m_attempt_cnt) <= 80 THEN 3
           WHEN (m_score/m_attempt_cnt)  > 80 AND (m_score/m_attempt_cnt) <= 90 THEN 4
           WHEN (m_score/m_attempt_cnt) > 90 AND (m_score/m_attempt_cnt) <= 100 THEN 5
		   ELSE 0
        END) as ass_m_starcnt,
		sum( CASE
		    WHEN (v_score/v_attempt_cnt) >= 20 AND (v_score/v_attempt_cnt) <= 40 THEN 1
           WHEN (v_score/v_attempt_cnt) > 40 AND (v_score/v_attempt_cnt) <= 60 THEN 2
           WHEN (v_score/v_attempt_cnt) > 60 AND (v_score/v_attempt_cnt) <= 80 THEN 3
           WHEN (v_score/v_attempt_cnt)  > 80 AND (v_score/v_attempt_cnt) <= 90 THEN 4
           WHEN (v_score/v_attempt_cnt) > 90 AND (v_score/v_attempt_cnt) <= 100 THEN 5
		    ELSE 0
        END ) as ass_v_starcnt,
		sum(CASE
		    WHEN (f_score/f_attempt_cnt) >= 20 AND (f_score/f_attempt_cnt) <= 40 THEN 1
           WHEN (f_score/f_attempt_cnt) > 40 AND (f_score/f_attempt_cnt) <= 60 THEN 2
           WHEN (f_score/f_attempt_cnt) > 60 AND (f_score/f_attempt_cnt) <= 80 THEN 3
           WHEN (f_score/f_attempt_cnt)  > 80 AND (f_score/f_attempt_cnt) <= 90 THEN 4
           WHEN (f_score/f_attempt_cnt) > 90 AND (f_score/f_attempt_cnt) <= 100 THEN 5
		    ELSE 0
        END ) as ass_f_starcnt,
		sum(CASE
		    WHEN (p_score/p_attempt_cnt) >= 20 AND (p_score/p_attempt_cnt) <= 40 THEN 1
           WHEN (p_score/p_attempt_cnt) > 40 AND (p_score/p_attempt_cnt) <= 60 THEN 2
           WHEN (p_score/p_attempt_cnt) > 60 AND (p_score/p_attempt_cnt) <= 80 THEN 3
           WHEN (p_score/p_attempt_cnt)  > 80 AND (p_score/p_attempt_cnt) <= 90 THEN 4
           WHEN (p_score/p_attempt_cnt) > 90 AND (p_score/p_attempt_cnt) <= 100 THEN 5
		    ELSE 0
        END ) as ass_p_starcnt,
		sum(CASE
		    WHEN (l_score/l_attempt_cnt) >= 20 AND (l_score/l_attempt_cnt) <= 40 THEN 1
           WHEN (l_score/l_attempt_cnt) > 40 AND (l_score/l_attempt_cnt) <= 60 THEN 2
           WHEN (l_score/l_attempt_cnt) > 60 AND (l_score/l_attempt_cnt) <= 80 THEN 3
           WHEN (l_score/l_attempt_cnt)  > 80 AND (l_score/l_attempt_cnt) <= 90 THEN 4
           WHEN (l_score/l_attempt_cnt) > 90 AND (l_score/l_attempt_cnt) <= 100 THEN 5
		   ELSE 0
        END ) as ass_l_starcnt
					from skillangels_userfinishcycle 
					where user_id=userid and ufc_id = any(id_array1)
					GROUP BY assess_status_id
					
			loop
				incr := incr+8;
				incr1 := incr1+8;
				id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
				BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
				counter:=counter+1;
			end loop;
			return next result;
		end loop;		
 	END IF;
	END;

END
$$;
 @   DROP FUNCTION public.gameasswisestar(userid text, eid integer);
       public       postgres    false    3    1            R           1255    144480 '   gameasswisestar(text, integer, integer)    FUNCTION     �4  CREATE FUNCTION public.gameasswisestar(userid text, eid integer, year_status integer) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $$
declare 
result RECORD;
len float;
len1 float;
len2 float;
len3 float;
id_array text ARRAY;
id_array1 text ARRAY;

incr integer;
incr1 integer;
arr_len integer;
BEGIN

-- len=CEIL((SELECT CAST ((select count(cycle_id) from skillangels_userfinishcycle where user_id=userid and current_year_status=year_status) AS FLOAT)/8));
len1 := (select count(ass_status_id) from skillangels_userscore where ass_status_id=1 and user_id =userid and event_id=eid and current_year_status=year_status);
len2 :=CEIL((SELECT CAST ((select count(assess_status_id) from skillangels_userfinishcycle WHERE  user_id=userid and current_year_status=year_status ) AS FLOAT)/8));
len3 := (select count(ass_status_id) from skillangels_userscore where ass_status_id=3 and user_id =userid and event_id=eid and current_year_status=year_status);

BEGIN
IF len1=1 and len2>0 and len3=1 THEN 
len:= len1+len2+len3;
ELSEIF len1=1 and len2>0 THEN
len:= len1+len2;
ELSE 
len:= len1;
END IF;
END;

 BEGIN
  	IF len1>0 then
 					SELECT  sum(distinct ass_status_id ),
 									sum(CASE
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 90 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 100 THEN 5
		   ELSE 0
        END)*8 as ass_m_starcnt,
		sum( CASE
		    WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 90 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_v_starcnt,
		sum(CASE
		    WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_f_starcnt,
		sum(CASE
		  WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_p_starcnt,
		sum(CASE
		  WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_l_starcnt
					from 
 					(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
 					skillangels_userscore where ass_status_id=1 and event_id=eid  and user_id=userid and current_year_status=year_status )as table1 into result;
  	return next result;
 	END IF;
 	END;
	
 	BEGIN
 	IF len3>0 then
 					SELECT  sum(distinct ass_status_id ),
 									sum(CASE
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 90 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 100 THEN 5
		   ELSE 0
        END)*8 as ass_m_starcnt,
		sum( CASE
		    WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 90 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_v_starcnt,
		sum(CASE
		    WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_f_starcnt,
		sum(CASE
		  WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_p_starcnt,
		sum(CASE
		  WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_l_starcnt
 					from 
 					(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
 					skillangels_userscore where ass_status_id=3 and event_id=eid  and user_id=userid and current_year_status=year_status  )as table1 into result;
 	return next result;
 	END IF;
 	END;
	
	BEGIN
	IF len2>0 then
	id_array:=(select array(select ufc_id from skillangels_userfinishcycle where assess_status_id=2 and user_id =userid and current_year_status=year_status order by date)) ;
	arr_len:=array_length(id_array, 1);
	incr:=1;
	incr1:=8;
	id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
		for counter in 1..len2
			loop
			BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
			For result in 
					select  sum(distinct assess_status_id)as ass_status_id ,
					sum(CASE
           WHEN (m_score/m_attempt_cnt) >= 20 AND (m_score/m_attempt_cnt) <= 40 THEN 1
           WHEN (m_score/m_attempt_cnt) > 40 AND (m_score/m_attempt_cnt) <= 60 THEN 2
           WHEN (m_score/m_attempt_cnt) > 60 AND (m_score/m_attempt_cnt) <= 80 THEN 3
           WHEN (m_score/m_attempt_cnt)  > 80 AND (m_score/m_attempt_cnt) <= 90 THEN 4
           WHEN (m_score/m_attempt_cnt) > 90 AND (m_score/m_attempt_cnt) <= 100 THEN 5
		   ELSE 0
        END) as ass_m_starcnt,
		sum( CASE
		    WHEN (v_score/v_attempt_cnt) >= 20 AND (v_score/v_attempt_cnt) <= 40 THEN 1
           WHEN (v_score/v_attempt_cnt) > 40 AND (v_score/v_attempt_cnt) <= 60 THEN 2
           WHEN (v_score/v_attempt_cnt) > 60 AND (v_score/v_attempt_cnt) <= 80 THEN 3
           WHEN (v_score/v_attempt_cnt)  > 80 AND (v_score/v_attempt_cnt) <= 90 THEN 4
           WHEN (v_score/v_attempt_cnt) > 90 AND (v_score/v_attempt_cnt) <= 100 THEN 5
		    ELSE 0
        END ) as ass_v_starcnt,
		sum(CASE
		    WHEN (f_score/f_attempt_cnt) >= 20 AND (f_score/f_attempt_cnt) <= 40 THEN 1
           WHEN (f_score/f_attempt_cnt) > 40 AND (f_score/f_attempt_cnt) <= 60 THEN 2
           WHEN (f_score/f_attempt_cnt) > 60 AND (f_score/f_attempt_cnt) <= 80 THEN 3
           WHEN (f_score/f_attempt_cnt)  > 80 AND (f_score/f_attempt_cnt) <= 90 THEN 4
           WHEN (f_score/f_attempt_cnt) > 90 AND (f_score/f_attempt_cnt) <= 100 THEN 5
		    ELSE 0
        END ) as ass_f_starcnt,
		sum(CASE
		    WHEN (p_score/p_attempt_cnt) >= 20 AND (p_score/p_attempt_cnt) <= 40 THEN 1
           WHEN (p_score/p_attempt_cnt) > 40 AND (p_score/p_attempt_cnt) <= 60 THEN 2
           WHEN (p_score/p_attempt_cnt) > 60 AND (p_score/p_attempt_cnt) <= 80 THEN 3
           WHEN (p_score/p_attempt_cnt)  > 80 AND (p_score/p_attempt_cnt) <= 90 THEN 4
           WHEN (p_score/p_attempt_cnt) > 90 AND (p_score/p_attempt_cnt) <= 100 THEN 5
		    ELSE 0
        END ) as ass_p_starcnt,
		sum(CASE
		    WHEN (l_score/l_attempt_cnt) >= 20 AND (l_score/l_attempt_cnt) <= 40 THEN 1
           WHEN (l_score/l_attempt_cnt) > 40 AND (l_score/l_attempt_cnt) <= 60 THEN 2
           WHEN (l_score/l_attempt_cnt) > 60 AND (l_score/l_attempt_cnt) <= 80 THEN 3
           WHEN (l_score/l_attempt_cnt)  > 80 AND (l_score/l_attempt_cnt) <= 90 THEN 4
           WHEN (l_score/l_attempt_cnt) > 90 AND (l_score/l_attempt_cnt) <= 100 THEN 5
		   ELSE 0
        END ) as ass_l_starcnt
					from skillangels_userfinishcycle 
					where user_id=userid and current_year_status=year_status and ufc_id = any(id_array1)
					GROUP BY assess_status_id
					
			loop
				incr := incr+8;
				incr1 := incr1+8;
				id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
				BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
				counter:=counter+1;
			end loop;
			return next result;
		end loop;		
 	END IF;
	END;

END
$$;
 U   DROP FUNCTION public.gameasswisestar(userid text, eid integer, year_status integer);
       public       postgres    false    3    1            S           1255    144482 0   gameasswisestar_maxbased(text, integer, integer)    FUNCTION     j2  CREATE FUNCTION public.gameasswisestar_maxbased(userid text, eid integer, year_status integer) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $$
declare 
result RECORD;
len float;
len1 float;
len2 float;
len3 float;
id_array text ARRAY;
id_array1 text ARRAY;

incr integer;
incr1 integer;
arr_len integer;
BEGIN

len1 := (select count(ass_status_id) from skillangels_userscore where ass_status_id=1 and user_id =userid and event_id=eid and current_year_status=year_status);
len2 :=CEIL((SELECT CAST ((select count(assess_status_id) from skillangels_usermaxscore WHERE  user_id=userid and current_year_status=year_status ) AS FLOAT)/8));
len3 := (select count(ass_status_id) from skillangels_userscore where ass_status_id=3 and user_id =userid and event_id=eid and current_year_status=year_status);

BEGIN
IF len1=1 and len2>0 and len3=1 THEN 
len:= len1+len2+len3;
ELSEIF len1=1 and len2>0 THEN
len:= len1+len2;
ELSE 
len:= len1;
END IF;
END;

 BEGIN
  	IF len1>0 then
 					SELECT  sum(distinct ass_status_id ),
 									sum(CASE
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 90 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 100 THEN 5
		   ELSE 0
        END)*8 as ass_m_starcnt,
		sum( CASE
		    WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 90 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_v_starcnt,
		sum(CASE
		    WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_f_starcnt,
		sum(CASE
		  WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_p_starcnt,
		sum(CASE
		  WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_l_starcnt
					from 
 					(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
 					skillangels_userscore where ass_status_id=1 and event_id=eid  and user_id=userid and current_year_status=year_status )as table1 into result;
  	return next result;
 	END IF;
 	END;
	
 	BEGIN
 	IF len3>0 then
 					SELECT  sum(distinct ass_status_id ),
 									sum(CASE
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='1' THEN table1.score  END) > 90 AND (CASE WHEN table1.skill_id ='1' THEN table1.score  END) <= 100 THEN 5
		   ELSE 0
        END)*8 as ass_m_starcnt,
		sum( CASE
		    WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='2' THEN table1.score  END) > 90 AND (CASE WHEN table1.skill_id ='2' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_v_starcnt,
		sum(CASE
		    WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='3' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='3' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_f_starcnt,
		sum(CASE
		  WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='4' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='4' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_p_starcnt,
		sum(CASE
		  WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) >= 20 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 40 THEN 1
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) > 40 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 60 THEN 2
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END) > 60 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 80 THEN 3
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END)  > 80 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 90 THEN 4
           WHEN (CASE WHEN table1.skill_id ='5' THEN table1.score  END)> 90 AND (CASE WHEN table1.skill_id ='5' THEN table1.score  END) <= 100 THEN 5
		    ELSE 0
        END )*8 as ass_l_starcnt
 					from 
 					(select game_id , score,ass_status_id, user_id,date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
 					skillangels_userscore where ass_status_id=3 and event_id=eid  and user_id=userid and current_year_status=year_status  )as table1 into result;
 	return next result;
 	END IF;
 	END;
	
	BEGIN
	IF len2>0 then
	id_array:=(select array(select ums_id from skillangels_usermaxscore where assess_status_id=2 and user_id =userid and current_year_status=year_status order by date)) ;
	arr_len:=array_length(id_array, 1);
	incr:=1;
	incr1:=8;
	id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
		for counter in 1..len2
			loop
			BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
			For result in 
					select  sum(distinct assess_status_id)as ass_status_id ,
					sum(CASE
           WHEN (max_m_score) >= 20 AND (max_m_score) <= 40 THEN 1
           WHEN (max_m_score) > 40 AND (max_m_score) <= 60 THEN 2
           WHEN (max_m_score) > 60 AND (max_m_score) <= 80 THEN 3
           WHEN (max_m_score)  > 80 AND (max_m_score) <= 90 THEN 4
           WHEN (max_m_score) > 90 AND (max_m_score) <= 100 THEN 5
		   ELSE 0
        END) as ass_m_starcnt,
		sum( CASE
		    WHEN (max_v_score) >= 20 AND (max_v_score) <= 40 THEN 1
           WHEN (max_v_score) > 40 AND (max_v_score) <= 60 THEN 2
           WHEN (max_v_score) > 60 AND (max_v_score) <= 80 THEN 3
           WHEN (max_v_score)  > 80 AND (max_v_score) <= 90 THEN 4
           WHEN (max_v_score) > 90 AND (max_v_score) <= 100 THEN 5
		    ELSE 0
        END ) as ass_v_starcnt,
		sum(CASE
		    WHEN (max_f_score) >= 20 AND (max_f_score) <= 40 THEN 1
           WHEN (max_f_score) > 40 AND (max_f_score) <= 60 THEN 2
           WHEN (max_f_score) > 60 AND (max_f_score) <= 80 THEN 3
           WHEN (max_f_score)  > 80 AND (max_f_score) <= 90 THEN 4
           WHEN (max_f_score) > 90 AND (max_f_score) <= 100 THEN 5
		    ELSE 0
        END ) as ass_f_starcnt,
		sum(CASE
		    WHEN (max_p_score) >= 20 AND (max_p_score) <= 40 THEN 1
           WHEN (max_p_score) > 40 AND (max_p_score) <= 60 THEN 2
           WHEN (max_p_score) > 60 AND (max_p_score) <= 80 THEN 3
           WHEN (max_p_score)  > 80 AND (max_p_score) <= 90 THEN 4
           WHEN (max_p_score) > 90 AND (max_p_score) <= 100 THEN 5
		    ELSE 0
        END ) as ass_p_starcnt,
		sum(CASE
		    WHEN (max_l_score) >= 20 AND (max_l_score) <= 40 THEN 1
           WHEN (max_l_score) > 40 AND (max_l_score) <= 60 THEN 2
           WHEN (max_l_score) > 60 AND (max_l_score) <= 80 THEN 3
           WHEN (max_l_score)  > 80 AND (max_l_score) <= 90 THEN 4
           WHEN (max_l_score) > 90 AND (max_l_score) <= 100 THEN 5
		   ELSE 0
        END ) as ass_l_starcnt
					from skillangels_usermaxscore 
					where user_id=userid and current_year_status=year_status and ums_id = any(id_array1)
					GROUP BY assess_status_id
					
			loop
				incr := incr+8;
				incr1 := incr1+8;
				id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
				BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
				counter:=counter+1;
			end loop;
			return next result;
		end loop;		
 	END IF;
	END;

END
$$;
 ^   DROP FUNCTION public.gameasswisestar_maxbased(userid text, eid integer, year_status integer);
       public       postgres    false    3    1            T           1255    144484 3   gamesskillkitscore_maxbased(text, integer, integer)    FUNCTION     *	  CREATE FUNCTION public.gamesskillkitscore_maxbased(userid text, eventid integer, year_status integer) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $$
declare 
result RECORD;
len float;
len1 float;
len2 float;
len3 float;
id_array text ARRAY;
id_array1 text ARRAY;

incr integer;
incr1 integer;
arr_len integer;
BEGIN

 len2 :=CEIL((SELECT CAST ((SELECT count(*) from skillangels_skillkit_usermaxscore where user_id=userid 
		and current_year_status=year_status) AS FLOAT)/8));
len :=(SELECT count(*) from skillangels_skillkit_usermaxscore where user_id=userid 
		and current_year_status=year_status);
BEGIN
-- IF len1=1 and len2>0 and len3=1 THEN 
-- len:= len1+len2+len3;
-- ELSEIF len1=1 and len2>0 THEN
-- len:= len1+len2;
-- ELSE 
-- len:= len1;
-- END IF;
END;
 	
	BEGIN
	IF len>0 then
	id_array:=(select array(select skillkit_ums_id from skillangels_skillkit_usermaxscore where current_year_status=year_status and user_id =userid order by played_date)) ;
	arr_len:=array_length(id_array, 1);
	incr:=1;
	incr1:=8;
	id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
		for counter in 1..len2
			loop
			BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
			For result in 
					select skillkit,
					CAST (Round(((Round(sum(max_m_score)))/count(max_m_score))) as text) as avg_m_score,
					CAST (Round(((Round(sum(max_v_score)))/count(max_v_score)))as text) as avg_v_score,
					CAST (Round(((Round(sum(max_f_score)))/count(max_f_score))) as text)as avg_f_score, 
					CAST (Round(((Round(sum(max_p_score)))/count(max_p_score))) as text)as avg_p_score,
					CAST (Round(((Round(sum(max_l_score)))/count(max_l_score))) as text) as avg_l_score
					from skillangels_skillkit_usermaxscore 
					where user_id=userid and current_year_status=year_status and skillkit_ums_id = any(id_array1)
					GROUP BY skillkit					
			loop
				incr := incr+8;
				incr1 := incr1+8;
				id_array1:=array[id_array[incr], id_array[incr+1], id_array[incr+2], id_array[incr+3], id_array[incr+4], id_array[incr+5], id_array[incr+6], id_array[incr+7]];
				BEGIN
				IF incr1>arr_len then
				incr1:=arr_len-1;
				END IF;
				END;
				counter:=counter+1;
			end loop;
			return next result;
		end loop;		
 	END IF;
	END;

END
$$;
 e   DROP FUNCTION public.gamesskillkitscore_maxbased(userid text, eventid integer, year_status integer);
       public       postgres    false    3    1            U           1255    144485 "   getbranchcodefrombranceid(integer)    FUNCTION       CREATE FUNCTION public.getbranchcodefrombranceid(branchid integer) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE
branch_code text;
BEGIN
 select branchcode into branch_code from skillangels_schoolbranch  where id = branchid;
 return branch_code;
END
 $$;
 B   DROP FUNCTION public.getbranchcodefrombranceid(branchid integer);
       public       postgres    false    1    3            V           1255    144486    getbranchcodefromuserid(text)    FUNCTION     0  CREATE FUNCTION public.getbranchcodefromuserid(user_id text) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE
branch_code text;
BEGIN
 select branchcode into branch_code from skillangels_schoolbranch  where id = (select branch_id from skillangels_users where id=user_id);
 return branch_code;
END

$$;
 <   DROP FUNCTION public.getbranchcodefromuserid(user_id text);
       public       postgres    false    3    1            W           1255    144487    getbranchid(text)    FUNCTION     '  CREATE FUNCTION public.getbranchid(username text) RETURNS integer
    LANGUAGE plpgsql
    AS $_$declare
branchid integer;
begin
select s.id into branchid from skillangels_admin as a inner join skillangels_schoolbranch as s on a.branch_id = s.id where a.username = $1;
return branchid;
end
$_$;
 1   DROP FUNCTION public.getbranchid(username text);
       public       postgres    false    3    1            X           1255    144488    getschoolid(text)    FUNCTION     %  CREATE FUNCTION public.getschoolid(username text) RETURNS integer
    LANGUAGE plpgsql
    AS $_$DECLARE
schoolid integer;
BEGIN
 select s.id into schoolid from skillangels_admin as a inner join skillangels_school as s on a.school_id = s.id where a.username = $1;
 return schoolid;
END

 $_$;
 1   DROP FUNCTION public.getschoolid(username text);
       public       postgres    false    1    3            Y           1255    144489    getserverdate()    FUNCTION     �   CREATE FUNCTION public.getserverdate() RETURNS date
    LANGUAGE plpgsql
    AS $$DECLARE
serverdate date;
BEGIN
 serverdate:= Date(now());
 return serverdate;
END

$$;
 &   DROP FUNCTION public.getserverdate();
       public       postgres    false    1    3            Z           1255    144490 "   getservernamefrombranceid(integer)    FUNCTION     �   CREATE FUNCTION public.getservernamefrombranceid(branchid integer) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE
s_name text;
BEGIN
 select servername into s_name from skillangels_current_server  where branch_id = branchid;
 return s_name;
END
$$;
 B   DROP FUNCTION public.getservernamefrombranceid(branchid integer);
       public       postgres    false    1    3            [           1255    144491    getservernamefromuserid(text)    FUNCTION     *  CREATE FUNCTION public.getservernamefromuserid(user_id text) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE
s_name text;
BEGIN
  select servername into s_name from skillangels_current_server  where branch_id = (select branch_id from skillangels_users where id=user_id);
 return s_name;
END
$$;
 <   DROP FUNCTION public.getservernamefromuserid(user_id text);
       public       postgres    false    3    1            \           1255    144492    getskill(integer)    FUNCTION     3  CREATE FUNCTION public.getskill(gameid integer) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $$
declare 
skillid integer;
result RECORD;
len float;
BEGIN

      SELECT game_id,skill_id into result
        FROM  skillangels_gamemaster
        WHERE  game_id=gameid ;

      return next result;
 
END
$$;
 /   DROP FUNCTION public.getskill(gameid integer);
       public       postgres    false    1    3            0           1255    144493 V   getskillkitgrades(text, integer, integer, integer, integer, integer, integer, integer)    FUNCTION     �  CREATE FUNCTION public.getskillkitgrades(userid text, ass_status integer, year_status integer, mgrade integer, vgrade integer, fgrade integer, pgrade integer, lgrade integer) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $$
declare 
result RECORD;
BEGIN

SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id 
FROM skillangels_gamemaster where skillangels_gamemaster.game_id in 
(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame 
where skillangels_gradecyclegame.cycle_id in (SELECT ((MOD(COUNT(date),8))+1)as count FROM skillangels_userfinishcycle 
WHERE skillangels_userfinishcycle.user_id=userid and skillangels_userfinishcycle.current_year_status=year_status ) 
and skillangels_gradecyclegame.assess_status_id=ass_status 
and skillangels_gradecyclegame.grade_id =mgrade
and skillangels_gradecyclegame.gcg_id in  
(select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  
INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id 
INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id 
INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  
where skillangels_users.id=userid)
) and skillangels_gamemaster.skill_id=1 into result;
return next result;

SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id 
FROM skillangels_gamemaster where skillangels_gamemaster.game_id in 
(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame 
where skillangels_gradecyclegame.cycle_id in (SELECT ((MOD(COUNT(date),8))+1)as count FROM skillangels_userfinishcycle 
WHERE skillangels_userfinishcycle.user_id=userid and skillangels_userfinishcycle.current_year_status=year_status ) 
and skillangels_gradecyclegame.assess_status_id=ass_status 
and skillangels_gradecyclegame.grade_id =vgrade
and skillangels_gradecyclegame.gcg_id in  
(select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  
INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id 
INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id 
INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  
where skillangels_users.id=userid)
) and skillangels_gamemaster.skill_id=2 into result;
return next result;

SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id 
FROM skillangels_gamemaster where skillangels_gamemaster.game_id in 
(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame 
where skillangels_gradecyclegame.cycle_id in (SELECT ((MOD(COUNT(date),8))+1)as count FROM skillangels_userfinishcycle 
WHERE skillangels_userfinishcycle.user_id=userid and skillangels_userfinishcycle.current_year_status=year_status ) 
and skillangels_gradecyclegame.assess_status_id=ass_status 
and skillangels_gradecyclegame.grade_id =fgrade
and skillangels_gradecyclegame.gcg_id in  
(select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  
INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id 
INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id 
INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  
where skillangels_users.id=userid)
) and skillangels_gamemaster.skill_id=3 into result;
return next result;

SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id 
FROM skillangels_gamemaster where skillangels_gamemaster.game_id in 
(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame 
where skillangels_gradecyclegame.cycle_id in (SELECT ((MOD(COUNT(date),8))+1)as count FROM skillangels_userfinishcycle 
WHERE skillangels_userfinishcycle.user_id=userid and skillangels_userfinishcycle.current_year_status=year_status ) 
and skillangels_gradecyclegame.assess_status_id=ass_status 
and skillangels_gradecyclegame.grade_id =pgrade
and skillangels_gradecyclegame.gcg_id in  
(select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  
INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id 
INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id 
INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  
where skillangels_users.id=userid)
) and skillangels_gamemaster.skill_id=4 into result;
return next result;

SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id 
FROM skillangels_gamemaster where skillangels_gamemaster.game_id in 
(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame 
where skillangels_gradecyclegame.cycle_id in (SELECT ((MOD(COUNT(date),8))+1)as count FROM skillangels_userfinishcycle 
WHERE skillangels_userfinishcycle.user_id=userid and skillangels_userfinishcycle.current_year_status=year_status ) 
and skillangels_gradecyclegame.assess_status_id=ass_status 
and skillangels_gradecyclegame.grade_id =lgrade
and skillangels_gradecyclegame.gcg_id in  
(select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  
INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id 
INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id 
INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  
where skillangels_users.id=userid)
) and skillangels_gamemaster.skill_id=5 into result;
return next result;

END
$$;
 �   DROP FUNCTION public.getskillkitgrades(userid text, ass_status integer, year_status integer, mgrade integer, vgrade integer, fgrade integer, pgrade integer, lgrade integer);
       public       postgres    false    1    3            1           1255    144494    new_skillangels_admin_pkey()    FUNCTION     �   CREATE FUNCTION public.new_skillangels_admin_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.id := (select getbranchcodefrombranceid(NEW.branch_id))|| (select getservernamefrombranceid(NEW.branch_id)) || NEW.id ;
  RETURN NEW;
END$$;
 3   DROP FUNCTION public.new_skillangels_admin_pkey();
       public       postgres    false    1    3            2           1255    144495 *   new_skillangels_branch_installation_pkey()    FUNCTION     �   CREATE FUNCTION public.new_skillangels_branch_installation_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.id := (select getbranchcodefrombranceid(NEW.branch_id)) || NEW.id ;
  RETURN NEW;
END$$;
 A   DROP FUNCTION public.new_skillangels_branch_installation_pkey();
       public       postgres    false    1    3            3           1255    144496 +   new_skillangels_branchgradecyclegame_pkey()    FUNCTION       CREATE FUNCTION public.new_skillangels_branchgradecyclegame_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.bgcg_id := (select getbranchcodefrombranceid(NEW.branch_id))|| (select getservernamefrombranceid(NEW.branch_id)) || NEW.bgcg_id ;
  RETURN NEW;
END$$;
 B   DROP FUNCTION public.new_skillangels_branchgradecyclegame_pkey();
       public       postgres    false    1    3            4           1255    144497     new_skillangels_crownylog_pkey()    FUNCTION     �   CREATE FUNCTION public.new_skillangels_crownylog_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.culogid := (select getbranchcodefromuserid(NEW.uid))|| (select getservernamefromuserid(NEW.uid)) || NEW.culogid ;
  RETURN NEW;
END$$;
 7   DROP FUNCTION public.new_skillangels_crownylog_pkey();
       public       postgres    false    1    3            5           1255    144498 %   new_skillangels_current_server_pkey()    FUNCTION     �   CREATE FUNCTION public.new_skillangels_current_server_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.id := (select getbranchcodefrombranceid(NEW.branch_id)) || NEW.id ;
  RETURN NEW;
END$$;
 <   DROP FUNCTION public.new_skillangels_current_server_pkey();
       public       postgres    false    3    1            6           1255    144499 %   new_skillangels_gameques_entry_pkey()    FUNCTION       CREATE FUNCTION public.new_skillangels_gameques_entry_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.gameques_id := (select getbranchcodefromuserid(NEW.user_id))|| (select getservernamefromuserid(NEW.user_id)) || NEW.gameques_id ;
  RETURN NEW;
END$$;
 <   DROP FUNCTION public.new_skillangels_gameques_entry_pkey();
       public       postgres    false    3    1            7           1255    144500 (   new_skillangels_games_cylce_entry_pkey()    FUNCTION     (  CREATE FUNCTION public.new_skillangels_games_cylce_entry_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.games_cycle_entry_id :=  (select getbranchcodefromuserid(NEW.user_id))|| (select getservernamefromuserid(NEW.user_id)) || NEW.games_cycle_entry_id ;
  RETURN NEW;
END
$$;
 ?   DROP FUNCTION public.new_skillangels_games_cylce_entry_pkey();
       public       postgres    false    3    1            8           1255    144501 "   new_skillangels_games_entry_pkey()    FUNCTION       CREATE FUNCTION public.new_skillangels_games_entry_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.games_entry_id :=  (select getbranchcodefromuserid(NEW.user_id))|| (select getservernamefromuserid(NEW.user_id)) || NEW.games_entry_id ;
  RETURN NEW;
END$$;
 9   DROP FUNCTION public.new_skillangels_games_entry_pkey();
       public       postgres    false    3    1            E           1255    144502    new_skillangels_loginlog_pkey()    FUNCTION     �   CREATE FUNCTION public.new_skillangels_loginlog_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.llid := (select getbranchcodefromuserid(NEW.uid))|| (select getservernamefromuserid(NEW.uid)) || NEW.llid ;
  RETURN NEW;
END$$;
 6   DROP FUNCTION public.new_skillangels_loginlog_pkey();
       public       postgres    false    1    3            F           1255    144503 &   new_skillangels_school_holidays_pkey()    FUNCTION       CREATE FUNCTION public.new_skillangels_school_holidays_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.id := (select getbranchcodefrombranceid(NEW.branch))|| (select getservernamefrombranceid(NEW.branch)) || NEW.id ;
  RETURN NEW;
END$$;
 =   DROP FUNCTION public.new_skillangels_school_holidays_pkey();
       public       postgres    false    1    3            G           1255    144504 %   new_skillangels_schoolacademic_pkey()    FUNCTION       CREATE FUNCTION public.new_skillangels_schoolacademic_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.id := (select getbranchcodefrombranceid(NEW.schoolid))|| (select getservernamefrombranceid(NEW.schoolid)) || NEW.id ;
  RETURN NEW;
END$$;
 <   DROP FUNCTION public.new_skillangels_schoolacademic_pkey();
       public       postgres    false    1    3            M           1255    144505 $   new_skillangels_schoolbranch_bcode()    FUNCTION     �   CREATE FUNCTION public.new_skillangels_schoolbranch_bcode() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
     NEW.branchcode := 'EDSIX00' || NEW.id || 'SA';
  RETURN NEW;
END ;
$$;
 ;   DROP FUNCTION public.new_skillangels_schoolbranch_bcode();
       public       postgres    false    3    1            N           1255    144506 "   new_skillangels_schoolgrade_pkey()    FUNCTION       CREATE FUNCTION public.new_skillangels_schoolgrade_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.id := (select getbranchcodefrombranceid(NEW.branch_id))|| (select getservernamefrombranceid(NEW.branch_id)) || NEW.id ;
  RETURN NEW;
END$$;
 9   DROP FUNCTION public.new_skillangels_schoolgrade_pkey();
       public       postgres    false    1    3            .           1255    144507 *   new_skillangels_schoolgradesections_pkey()    FUNCTION     
  CREATE FUNCTION public.new_skillangels_schoolgradesections_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.id := (select getbranchcodefrombranceid(NEW.branchid))|| (select getservernamefrombranceid(NEW.branchid)) || NEW.id ;
  RETURN NEW;
END$$;
 A   DROP FUNCTION public.new_skillangels_schoolgradesections_pkey();
       public       postgres    false    3    1            /           1255    144508 #   new_skillangels_schoolperiod_pkey()    FUNCTION       CREATE FUNCTION public.new_skillangels_schoolperiod_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.id := (select getbranchcodefrombranceid(NEW.branchid))|| (select getservernamefrombranceid(NEW.branchid)) || NEW.id ;
  RETURN NEW;
END$$;
 :   DROP FUNCTION public.new_skillangels_schoolperiod_pkey();
       public       postgres    false    3    1            ]           1255    144509 &   new_skillangels_schooltimetable_pkey()    FUNCTION       CREATE FUNCTION public.new_skillangels_schooltimetable_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.id := (select getbranchcodefrombranceid(NEW.branchid))|| (select getservernamefrombranceid(NEW.branchid)) || NEW.id ;
  RETURN NEW;
END$$;
 =   DROP FUNCTION public.new_skillangels_schooltimetable_pkey();
       public       postgres    false    1    3            ^           1255    144510 ,   new_skillangels_skillkit_usermaxscore_pkey()    FUNCTION     "  CREATE FUNCTION public.new_skillangels_skillkit_usermaxscore_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.skillkit_ums_id :=  (select getbranchcodefromuserid(NEW.user_id))|| (select getservernamefromuserid(NEW.user_id)) || NEW.skillkit_ums_id ;
  RETURN NEW;
END
$$;
 C   DROP FUNCTION public.new_skillangels_skillkit_usermaxscore_pkey();
       public       postgres    false    3    1            _           1255    144511 0   new_skillangels_skillkitgames_cylce_entry_pkey()    FUNCTION     @  CREATE FUNCTION public.new_skillangels_skillkitgames_cylce_entry_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.skillkitgames_cycle_entry_id :=  (select getbranchcodefromuserid(NEW.user_id))|| (select getservernamefromuserid(NEW.user_id)) || NEW.skillkitgames_cycle_entry_id ;
  RETURN NEW;
END
$$;
 G   DROP FUNCTION public.new_skillangels_skillkitgames_cylce_entry_pkey();
       public       postgres    false    3    1            `           1255    144512 $   new_skillangels_skillkitscore_pkey()    FUNCTION       CREATE FUNCTION public.new_skillangels_skillkitscore_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.skscore_id := (select getbranchcodefromuserid(NEW.user_id))|| (select getservernamefromuserid(NEW.user_id)) || NEW.skscore_id ;
  RETURN NEW;
END$$;
 ;   DROP FUNCTION public.new_skillangels_skillkitscore_pkey();
       public       postgres    false    3    1            a           1255    144513 .   new_skillangels_training_gameques_entry_pkey()    FUNCTION     )  CREATE FUNCTION public.new_skillangels_training_gameques_entry_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.gameques_train_id := (select getbranchcodefromuserid(NEW.user_id))|| (select getservernamefromuserid(NEW.user_id)) || NEW.gameques_train_id ;
    RETURN NEW;
END
$$;
 E   DROP FUNCTION public.new_skillangels_training_gameques_entry_pkey();
       public       postgres    false    1    3            b           1255    144514 )   new_skillangels_training_userscore_pkey()    FUNCTION     &  CREATE FUNCTION public.new_skillangels_training_userscore_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.userscore_train_id := (select getbranchcodefromuserid(NEW.user_id))|| (select getservernamefromuserid(NEW.user_id)) || NEW.userscore_train_id ;
    RETURN NEW;
END
$$;
 @   DROP FUNCTION public.new_skillangels_training_userscore_pkey();
       public       postgres    false    3    1            c           1255    144515 &   new_skillangels_userfinishcycle_pkey()    FUNCTION       CREATE FUNCTION public.new_skillangels_userfinishcycle_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.ufc_id := (select getbranchcodefromuserid(NEW.user_id))|| (select getservernamefromuserid(NEW.user_id)) || NEW.ufc_id ;
  RETURN NEW;
END$$;
 =   DROP FUNCTION public.new_skillangels_userfinishcycle_pkey();
       public       postgres    false    3    1            d           1255    144516 #   new_skillangels_usermaxscore_pkey()    FUNCTION       CREATE FUNCTION public.new_skillangels_usermaxscore_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.ums_id := (select getbranchcodefromuserid(NEW.user_id))|| (select getservernamefromuserid(NEW.user_id)) || NEW.ums_id ;
  RETURN NEW;
END$$;
 :   DROP FUNCTION public.new_skillangels_usermaxscore_pkey();
       public       postgres    false    3    1            e           1255    144517    new_skillangels_users_pkey()    FUNCTION     �   CREATE FUNCTION public.new_skillangels_users_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.id := (select getbranchcodefrombranceid(NEW.branch_id))|| (select getservernamefrombranceid(NEW.branch_id)) || NEW.id ;
  RETURN NEW;
END$$;
 3   DROP FUNCTION public.new_skillangels_users_pkey();
       public       postgres    false    3    1            f           1255    144518     new_skillangels_userscore_pkey()    FUNCTION       CREATE FUNCTION public.new_skillangels_userscore_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.userscore_id := (select getbranchcodefromuserid(NEW.user_id))|| (select getservernamefromuserid(NEW.user_id)) || NEW.userscore_id ;
  RETURN NEW;
END$$;
 7   DROP FUNCTION public.new_skillangels_userscore_pkey();
       public       postgres    false    3    1            g           1255    144519 %   new_skillangels_usertotalvalue_pkey()    FUNCTION       CREATE FUNCTION public.new_skillangels_usertotalvalue_pkey() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.utv_id := (select getbranchcodefromuserid(NEW.user_id))|| (select getservernamefromuserid(NEW.user_id)) || NEW.utv_id ;
  RETURN NEW;
END$$;
 <   DROP FUNCTION public.new_skillangels_usertotalvalue_pkey();
       public       postgres    false    3    1            h           1255    144520    score_push_restriction()    FUNCTION     �  CREATE FUNCTION public.score_push_restriction() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	DECLARE
		ass_status integer;
		totalcnt integer;
	BEGIN
		IF (TG_OP = 'INSERT') THEN
			ass_status := new.ass_status_id;
			raise notice 'ass_status: %', ass_status;
				

			if(ass_status = 1 or ass_status = 3 or ass_status = 5 or ass_status = 4 ) then
			totalcnt := (select count(*) from skillangels_userscore where 
						 ass_status_id = new.ass_status_id and game_id = new.game_id and 
						 user_id = new.user_id and current_year_status=new.current_year_status
						and event_id = new.event_id);
			raise notice 'totalcnt: %', totalcnt;
			raise notice 'game_id: %', new.game_id;
				if(totalcnt = 1) then
					return null;
				else
					return new;
				end if;
			elseif(ass_status = 2) then
				totalcnt := (select count(*) from skillangels_userscore where 
						 ass_status_id = new.ass_status_id and game_id = new.game_id and 
						 user_id = new.user_id and current_year_status=new.current_year_status
						and event_id = new.event_id and DATE(date)=DATE(new.date));
			raise notice 'totalcnt: %', totalcnt;
			raise notice 'game_id: %', new.game_id;
				if(totalcnt = 5) then
					return null;
				else 
					return new;
				end if;
				elseif(ass_status = 6) then
				totalcnt := (select count(*) from skillangels_userscore where 
						 ass_status_id = new.ass_status_id and game_id = new.game_id and 
						 user_id = new.user_id and current_year_status=new.current_year_status
						and event_id = new.event_id and DATE(date)=DATE(new.date));
			raise notice 'totalcnt: %', totalcnt;
			raise notice 'game_id: %', new.game_id;
				if(totalcnt = 1) then
					return null;
				else 
					return new;
				end if;
			end if;
		end if;
	END;
$$;
 /   DROP FUNCTION public.score_push_restriction();
       public       postgres    false    3    1            i           1255    144521    set_finish_status()    FUNCTION     �  CREATE FUNCTION public.set_finish_status() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
		ass_status integer;
		totalcnt integer;
    BEGIN
        --
        -- Create a row in emp_audit to reflect the operation performed on emp,
        -- make use of the special variable TG_OP to work out the operation.
        --
      
       IF (TG_OP = 'INSERT') THEN
            ass_status := new.ass_status_id;
			raise notice 'ass_status: %', ass_status;

            if(ass_status = 1 or ass_status = 3 or ass_status = 5 or ass_status = 4 or ass_status = 2 ) then
              Update skillangels_gameques_entry set finish_status = 1 where user_id = new.user_id
 				and game_id = new.game_id  and current_year_status= new.current_year_status and 
				ass_status_id = new.ass_status_id;
				RETURN NEW;
              elseif(ass_status = 6) then
                Update skillangels_gameques_entry set finish_status = 1 where user_id = new.user_id
 				and game_id = new.game_id and Date(answeredtime) = Date(new.date) and 
                 current_year_status= new.current_year_status and
				ass_status_id = new.ass_status_id;
				RETURN NEW;
             end if;
        
        END IF;
        
    END;
$$;
 *   DROP FUNCTION public.set_finish_status();
       public       postgres    false    3    1            j           1255    144522     set_finish_status_ass2training()    FUNCTION     R  CREATE FUNCTION public.set_finish_status_ass2training() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
		ass_status integer;
		totalcnt integer;
    BEGIN
        --
        -- Create a row in emp_audit to reflect the operation performed on emp,
        -- make use of the special variable TG_OP to work out the operation.
        --
      
       IF (TG_OP = 'INSERT') THEN
            ass_status := new.ass_status_id;
			raise notice 'ass_status: %', ass_status;
           
              Update skillangels_training_gameques_entry set finish_status = 1 where user_id = new.user_id
 			  and game_id = new.game_id and Date(answeredtime) = Date(new.date) and 
              current_year_status= new.current_year_status and
			  ass_status_id = new.ass_status_id;
			  RETURN NEW;
                      
        END IF;
        
    END;
$$;
 7   DROP FUNCTION public.set_finish_status_ass2training();
       public       postgres    false    3    1            k           1255    144523    set_skillkitfinish_status()    FUNCTION     r  CREATE FUNCTION public.set_skillkitfinish_status() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        --
        -- Create a row in emp_audit to reflect the operation performed on emp,
        -- make use of the special variable TG_OP to work out the operation.
        --
      
       IF (TG_OP = 'INSERT') THEN
            Update skillangels_gameques_entry set finish_status = 1 where user_id = new.user_id
 				and game_id = new.game_id  and current_year_status= new.current_year_status and
				ass_status_id = (new.skillkit)-(new.skillkit * 2);
            RETURN NEW;
        END IF;
        
    END;
$$;
 2   DROP FUNCTION public.set_skillkitfinish_status();
       public       postgres    false    1    3            l           1255    144524 ?   set_total_score(text, integer, integer, integer, date, integer)    FUNCTION     �  CREATE FUNCTION public.set_total_score(userid text, eid integer, score integer, crowny integer, today date, year_status integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare 
result integer;
val integer;
len integer;
BEGIN
val:=1;
len := (select count(*) from skillangels_usertotalvalue where user_id=userid and current_year_status=year_status);

BEGIN
  	IF len<1 then
 						INSERT INTO skillangels_usertotalvalue (user_id,totalscore,totalstar,totalcrowny,date,status,current_year_status) 
					VALUES (userid,score,0,crowny,today,1,year_status);
				
		 	END IF;
 	END;
	 	BEGIN
 	IF len>0 then
 				UPDATE skillangels_usertotalvalue SET 
		totalscore =totalscore +score,
		totalstar = 0,
		totalcrowny=totalcrowny +crowny,
        date=today,
				status=1,
                current_year_status=year_status
                 where user_id=userid;
	
		 	END IF;
 	END;
	return len;
	END
$$;
 �   DROP FUNCTION public.set_total_score(userid text, eid integer, score integer, crowny integer, today date, year_status integer);
       public       postgres    false    3    1            m           1255    144525 4   settotalscore(text, integer, integer, integer, date)    FUNCTION     �  CREATE FUNCTION public.settotalscore(userid text, eid integer, score integer, crowny integer, today date) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare 
result integer;
val integer;
len integer;
BEGIN
val:=1;
len := (select count(*) from skillangels_usertotalvalue where user_id=userid);

 BEGIN
  	IF len<1 then
 						INSERT INTO skillangels_usertotalvalue (user_id,totalscore,totalstar,totalcrowny,date,status) 
					VALUES (userid,score,0,crowny,today,1);
				
		 	END IF;
 	END;
	 	BEGIN
 	IF len>0 then
 				UPDATE skillangels_usertotalvalue SET 
		totalscore =totalscore +score,
		totalstar = 0,
		totalcrowny=totalcrowny +crowny,
        date=today,
				status=1 where user_id=userid;
	
		 	END IF;
 	END;
	return len;
	END
$$;
 i   DROP FUNCTION public.settotalscore(userid text, eid integer, score integer, crowny integer, today date);
       public       postgres    false    3    1            n           1255    144526 $   skillkit_enter_max_ass_cycle_score()    FUNCTION     Y  CREATE FUNCTION public.skillkit_enter_max_ass_cycle_score() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
actal_dis_cnt integer;
dis_cnt integer;
act_start_cnt integer ;
today_date DATE := now();
    BEGIN
        --
        -- Create a row in emp_audit to reflect the operation performed on emp,
        -- make use of the special variable TG_OP to work out the operation.
        --
    
        IF (TG_OP = 'INSERT') THEN

        actal_dis_cnt:=(select skillcnt from skillangels_skillkitgames_cylce_entry where 
                user_id =new.user_id  and event_id =new.event_id
                and current_year_status =new.current_year_status order by actual_start_date 
                desc LIMIT 1);
        	
                dis_cnt:=(select count(distinct game_id) from skillangels_skillkitscore where user_id=new.user_id and 
                current_year_status=new.current_year_status and event_id =new.event_id  and Date(played_date)>=
                Date( (select actual_start_date from skillangels_skillkitgames_cylce_entry where user_id =new.user_id  and event_id =new.event_id 
                and current_year_status =new.current_year_status order by actual_start_date desc LIMIT 1)));

                act_start_cnt:=(select count(played_date) from skillangels_skillkit_usermaxscore where  user_id =new.user_id 
                and current_year_status =new.current_year_status and played_date= (select actual_start_date from skillangels_skillkitgames_cylce_entry where 
                user_id =new.user_id  and event_id =new.event_id
                and current_year_status =new.current_year_status order by actual_start_date 
                desc LIMIT 1));

                              
                IF (dis_cnt=actal_dis_cnt)  THEN
                        IF (act_start_cnt=0) THEN

                                INSERT INTO skillangels_skillkit_usermaxscore (skillkit,user_id,max_m_score, max_v_score,
                                                                    max_f_score, max_p_score,
                                                                    max_l_score,played_date, current_year_status)

                                select table2.skillkit,table2.uid,table2.m_score,table2.v_score,table2.f_score,table2.p_score,table2.l_score,(select actual_start_date from skillangels_skillkitgames_cylce_entry where 
                                user_id =new.user_id  and event_id =new.event_id
                                and current_year_status =new.current_year_status order by actual_start_date 
                                desc LIMIT 1),new.current_year_status
                                from
                                (SELECT   sum(distinct NEW.skillkit)as skillkit,  NEW.user_id as uid, 
                                sum(  CASE WHEN table1.skill_id ='1' THEN table1.score  END) AS m_score,
                                sum(  CASE WHEN table1.skill_id ='2' THEN table1.score  END) AS v_score,
                                sum(  CASE WHEN table1.skill_id ='3' THEN table1.score  END) AS f_score,
                                sum(  CASE WHEN table1.skill_id ='4' THEN table1.score  END) AS p_score,
                                sum(  CASE WHEN table1.skill_id ='5' THEN table1.score  END) AS l_score
                                from (
                                (select game_id , score,skillkit, user_id,played_date,(select skill_id from getskill(game_id) as t(game_id int,skill_id int)) from 
                                skillangels_skillkitscore where event_id=new.event_id  and user_id=new.user_id and 
                                DATE(played_date)>=(select actual_start_date from skillangels_skillkitgames_cylce_entry where 
                                user_id =new.user_id  and event_id =new.event_id
                                and current_year_status =new.current_year_status order by actual_start_date 
                                desc LIMIT 1) and current_year_status=new.current_year_status ))as table1 ) as table2;
                                RETURN NEW;
                       

                        ELSIF (act_start_cnt=1) THEN
                         			

                           
                                    UPDATE skillangels_skillkit_usermaxscore
                                    SET    
                                    max_m_score= table3.m_score,
                                    max_v_score= table3.v_score ,
                                    max_f_score= table3.f_score ,
                                    max_p_score= table3.p_score ,
                                    max_l_score= table3.l_score 
                                    from 
                                    (SELECT      							
                                        sum(  CASE WHEN table1.skill_id ='1' THEN table1.score  END) AS m_score,
                                        sum(  CASE WHEN table1.skill_id ='2' THEN table1.score  END) AS v_score,
                                        sum(  CASE WHEN table1.skill_id ='3' THEN table1.score  END) AS f_score,
                                        sum(  CASE WHEN table1.skill_id ='4' THEN table1.score  END) AS p_score,
                                        sum(  CASE WHEN table1.skill_id ='5' THEN table1.score  END) AS l_score
                                        from 
                                        (select max(score) as score,skill_id from
                                        (select game_id ,score ,skillkit, user_id,played_date,(select skill_id from getskill(game_id) 
                                        as t(game_id int,skill_id int)) from 
                                        skillangels_skillkitscore where 
                                         event_id=new.event_id  and user_id=new.user_id and 
                                        DATE(played_date)>=(select actual_start_date from skillangels_skillkitgames_cylce_entry where 
                                        user_id =new.user_id  and event_id =new.event_id
                                        and current_year_status =new.current_year_status order by actual_start_date 
                                        desc LIMIT 1) and 
                                        current_year_status=new.current_year_status )as table2
                                        group by skill_id) as table1) as table3
                                        WHERE  user_id=new.user_id and DATE(played_date)=(select actual_start_date from 
                                        skillangels_skillkitgames_cylce_entry where 
                                        user_id =new.user_id  and event_id =new.event_id
                                        and current_year_status =new.current_year_status order by actual_start_date 
                                        desc LIMIT 1) and current_year_status=new.current_year_status  ;
                                    RETURN NEW;
                                
                              
                               
							END IF;
					 END IF;	
			
            
		END IF;	  
			      
-- 			RETURN NEW;
		
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$$;
 ;   DROP FUNCTION public.skillkit_enter_max_ass_cycle_score();
       public       postgres    false    3    1            o           1255    144527    update_cycle_entry()    FUNCTION     �  CREATE FUNCTION public.update_cycle_entry() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	dis_cnt integer;
	played_status integer;
    BEGIN
        --
        -- Create a row in emp_audit to reflect the operation performed on emp,
        -- make use of the special variable TG_OP to work out the operation.
        --
    
        IF (TG_OP = 'INSERT') THEN
		
            update skillangels_games_cylce_entry set status =1,played_end_date=DATE(now()) where 
            ass_status_id=New.assess_status_id and current_year_status=new.current_year_status
            and user_id=NEW.user_id  and 
            actual_start_date=(select actual_start_date from skillangels_games_cylce_entry where 
            user_id =NEW.user_id   and current_year_status =new.current_year_status order by actual_start_date 
            desc LIMIT 1);
			RETURN NEW;
		END IF;
        RETURN NULL; -- result is ignored since this is an AFTER trigger
		
    END;
$$;
 +   DROP FUNCTION public.update_cycle_entry();
       public       postgres    false    1    3            �            1259    144528    config_id_seq    SEQUENCE     v   CREATE SEQUENCE public.config_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.config_id_seq;
       public       postgres    false    3            �            1259    144530    config    TABLE       CREATE TABLE public.config (
    id integer DEFAULT nextval('public.config_id_seq'::regclass) NOT NULL,
    configname text NOT NULL,
    configvalue text NOT NULL,
    description text NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    "Sync_Flag" integer DEFAULT 0 NOT NULL
);
    DROP TABLE public.config;
       public         postgres    false    196    3            �            1259    144539    country_timezone_id_seq    SEQUENCE     �   CREATE SEQUENCE public.country_timezone_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.country_timezone_id_seq;
       public       postgres    false    3            �            1259    144541    country_timezone    TABLE       CREATE TABLE public.country_timezone (
    id integer DEFAULT nextval('public.country_timezone_id_seq'::regclass) NOT NULL,
    countryname text NOT NULL,
    timezone text NOT NULL,
    status integer NOT NULL,
    timing integer NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL
);
 $   DROP TABLE public.country_timezone;
       public         postgres    false    198    3            �            1259    144549    crownylog_culogid_seq    SEQUENCE     ~   CREATE SEQUENCE public.crownylog_culogid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.crownylog_culogid_seq;
       public       postgres    false    3            �            1259    144551    gameques_id_seq    SEQUENCE     x   CREATE SEQUENCE public.gameques_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.gameques_id_seq;
       public       postgres    false    3            �            1259    144553    sbc_game_ssg_id_seq    SEQUENCE     |   CREATE SEQUENCE public.sbc_game_ssg_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.sbc_game_ssg_id_seq;
       public       postgres    false    3            �            1259    144555    school_config    TABLE     �   CREATE TABLE public.school_config (
    id integer NOT NULL,
    branch_id integer NOT NULL,
    isemailneed "char",
    maildays character varying,
    "to" text,
    emailcc text
);
 !   DROP TABLE public.school_config;
       public         postgres    false    3            �            1259    144561    school_config_id_seq    SEQUENCE     �   CREATE SEQUENCE public.school_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.school_config_id_seq;
       public       postgres    false    203    3            �           0    0    school_config_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.school_config_id_seq OWNED BY public.school_config.id;
            public       postgres    false    204            �            1259    144563    schoolconfig_id_seq    SEQUENCE     |   CREATE SEQUENCE public.schoolconfig_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.schoolconfig_id_seq;
       public       postgres    false    3            �            1259    144565    schoolconfig    TABLE     B  CREATE TABLE public.schoolconfig (
    id integer DEFAULT nextval('public.schoolconfig_id_seq'::regclass) NOT NULL,
    schoolid integer NOT NULL,
    configname text NOT NULL,
    configvalue text NOT NULL,
    description text NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL
);
     DROP TABLE public.schoolconfig;
       public         postgres    false    205    3            �            1259    144574    skillangel_users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangel_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.skillangel_users_id_seq;
       public       postgres    false    3            �            1259    144576    skillangels_admins_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_admins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.skillangels_admins_id_seq;
       public       postgres    false    3            �            1259    144578    skillangels_admin    TABLE     �  CREATE TABLE public.skillangels_admin (
    id text DEFAULT nextval('public.skillangels_admins_id_seq'::regclass) NOT NULL,
    username text NOT NULL,
    emailid text NOT NULL,
    mobileno bigint NOT NULL,
    password text NOT NULL,
    roleid integer NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    created_by text NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    modified_by text NOT NULL,
    status integer NOT NULL,
    branch_id integer NOT NULL,
    school_id integer NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL
);
 %   DROP TABLE public.skillangels_admin;
       public         postgres    false    208    3            �            1259    144588 #   skillangels_assessment_assessid_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_assessment_assessid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.skillangels_assessment_assessid_seq;
       public       postgres    false    3            �            1259    144590    skillangels_assessment    TABLE     "  CREATE TABLE public.skillangels_assessment (
    assessid integer DEFAULT nextval('public.skillangels_assessment_assessid_seq'::regclass) NOT NULL,
    assessname character varying(50),
    description character varying(200),
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 *   DROP TABLE public.skillangels_assessment;
       public         postgres    false    210    3            �            1259    144595 2   skillangels_assessment_status_assess_status_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_assessment_status_assess_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 I   DROP SEQUENCE public.skillangels_assessment_status_assess_status_id_seq;
       public       postgres    false    3            �            1259    144597    skillangels_assessment_status    TABLE     W  CREATE TABLE public.skillangels_assessment_status (
    assess_status_id integer DEFAULT nextval('public.skillangels_assessment_status_assess_status_id_seq'::regclass) NOT NULL,
    assessment_status_name character varying(200),
    assessment_status_des character varying(200),
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 1   DROP TABLE public.skillangels_assessment_status;
       public         postgres    false    212    3            �            1259    144602 "   skillangels_branch_installation_id    SEQUENCE     �   CREATE SEQUENCE public.skillangels_branch_installation_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.skillangels_branch_installation_id;
       public       postgres    false    3            �            1259    144604    skillangels_branch_installation    TABLE     �   CREATE TABLE public.skillangels_branch_installation (
    id text DEFAULT nextval('public.skillangels_branch_installation_id'::regclass) NOT NULL,
    branch_id integer,
    ipaddress text NOT NULL,
    status integer DEFAULT 0
);
 3   DROP TABLE public.skillangels_branch_installation;
       public         postgres    false    214    3            �            1259    144612 ,   skillangels_branchgradecyclegame_bgcg_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_branchgradecyclegame_bgcg_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 C   DROP SEQUENCE public.skillangels_branchgradecyclegame_bgcg_id_seq;
       public       postgres    false    3            �            1259    144614     skillangels_branchgradecyclegame    TABLE       CREATE TABLE public.skillangels_branchgradecyclegame (
    bgcg_id text DEFAULT nextval('public.skillangels_branchgradecyclegame_bgcg_id_seq'::regclass) NOT NULL,
    branch_id integer,
    gcg_id text,
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 4   DROP TABLE public.skillangels_branchgradecyclegame;
       public         postgres    false    216    3            �            1259    144622    skillangels_crownylog    TABLE       CREATE TABLE public.skillangels_crownylog (
    culogid text DEFAULT nextval('public.crownylog_culogid_seq'::regclass) NOT NULL,
    uid text,
    crowny integer,
    addeddate date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date,
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL,
    reason character varying(200),
    addedtime timestamp without time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP(0)),
    current_year_status integer DEFAULT 1
);
 )   DROP TABLE public.skillangels_crownylog;
       public         postgres    false    200    3            �            1259    144633    skillangels_current_server_id    SEQUENCE     �   CREATE SEQUENCE public.skillangels_current_server_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.skillangels_current_server_id;
       public       postgres    false    3            �            1259    144635    skillangels_current_server    TABLE     �   CREATE TABLE public.skillangels_current_server (
    id text DEFAULT nextval('public.skillangels_current_server_id'::regclass) NOT NULL,
    branch_id integer,
    servername text NOT NULL,
    status integer DEFAULT 0
);
 .   DROP TABLE public.skillangels_current_server;
       public         postgres    false    219    3            �            1259    144643    skillangels_cycle_cycle_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_cycle_cycle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.skillangels_cycle_cycle_id_seq;
       public       postgres    false    3            �            1259    144645    skillangels_cycle    TABLE       CREATE TABLE public.skillangels_cycle (
    cycle_id integer DEFAULT nextval('public.skillangels_cycle_cycle_id_seq'::regclass) NOT NULL,
    cyclename character varying(355),
    cycledescription character varying(355),
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 %   DROP TABLE public.skillangels_cycle;
       public         postgres    false    221    3            �            1259    144653    skillangels_eod_mail_log    TABLE     �   CREATE TABLE public.skillangels_eod_mail_log (
    id integer NOT NULL,
    branch_id integer,
    sent_on timestamp(6) without time zone,
    status integer
);
 ,   DROP TABLE public.skillangels_eod_mail_log;
       public         postgres    false    3            �            1259    144656    skillangels_eod_mail_log_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_eod_mail_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.skillangels_eod_mail_log_id_seq;
       public       postgres    false    223    3            �           0    0    skillangels_eod_mail_log_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.skillangels_eod_mail_log_id_seq OWNED BY public.skillangels_eod_mail_log.id;
            public       postgres    false    224            �            1259    144658    skillangels_event_event_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_event_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.skillangels_event_event_id_seq;
       public       postgres    false    3            �            1259    144660    skillangels_event    TABLE       CREATE TABLE public.skillangels_event (
    event_id integer DEFAULT nextval('public.skillangels_event_event_id_seq'::regclass) NOT NULL,
    eventname character varying(355),
    eventdescription character varying(355),
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 %   DROP TABLE public.skillangels_event;
       public         postgres    false    225    3            �            1259    144668    skillangels_feedback_seqid    SEQUENCE     �   CREATE SEQUENCE public.skillangels_feedback_seqid
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.skillangels_feedback_seqid;
       public       postgres    false    3            �            1259    144670    skillangels_feedback    TABLE     �  CREATE TABLE public.skillangels_feedback (
    sf_id integer DEFAULT nextval('public.skillangels_feedback_seqid'::regclass) NOT NULL,
    user_id text,
    assessment_experience character varying(250),
    how_to_play_instruction character varying(250),
    about_program character varying(250),
    solve_puzzles character varying(250),
    share_assessment_experience character varying(250),
    description text,
    status integer,
    sync_flag integer DEFAULT 1,
    current_year_status integer
);
 (   DROP TABLE public.skillangels_feedback;
       public         postgres    false    227    3            �            1259    144678 "   skillangels_gamemaster_game_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_gamemaster_game_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.skillangels_gamemaster_game_id_seq;
       public       postgres    false    3            �            1259    144680    skillangels_gamemaster    TABLE     9  CREATE TABLE public.skillangels_gamemaster (
    game_id integer DEFAULT nextval('public.skillangels_gamemaster_game_id_seq'::regclass) NOT NULL,
    skill_id integer,
    gamename character varying(355),
    gamedescription character varying(355),
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 *   DROP TABLE public.skillangels_gamemaster;
       public         postgres    false    229    3            �            1259    144688    skillangels_gameques_entry    TABLE     G  CREATE TABLE public.skillangels_gameques_entry (
    gameques_id text DEFAULT nextval('public.gameques_id_seq'::regclass) NOT NULL,
    user_id text,
    game_id integer,
    event_id integer,
    quesno text,
    score integer,
    ansvalidation character varying(50),
    responsetime integer,
    answeredtime timestamp without time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP(0)),
    ass_status_id integer,
    finish_status integer DEFAULT 0 NOT NULL,
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL,
    current_year_status integer DEFAULT 1
);
 .   DROP TABLE public.skillangels_gameques_entry;
       public         postgres    false    201    3            �            1259    144699 !   skillangels_games_cylce_entry_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_games_cylce_entry_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.skillangels_games_cylce_entry_seq;
       public       postgres    false    3            �            1259    144701    skillangels_games_cylce_entry    TABLE     
  CREATE TABLE public.skillangels_games_cylce_entry (
    games_cycle_entry_id text DEFAULT nextval('public.skillangels_games_cylce_entry_seq'::regclass) NOT NULL,
    user_id text NOT NULL,
    mem_game_id integer,
    vp_game_id integer,
    fa_game_id integer,
    ps_game_id integer,
    lin_game_id integer,
    mem_name text,
    vp_name text,
    fa_name text,
    ps_name text,
    lin_name text,
    ass_status_id integer,
    event_id integer,
    current_year_status integer DEFAULT 1,
    actual_start_date timestamp without time zone,
    actual_end_date timestamp without time zone,
    played_start_date timestamp without time zone,
    played_end_date timestamp without time zone,
    status integer DEFAULT 0 NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL
);
 1   DROP TABLE public.skillangels_games_cylce_entry;
       public         postgres    false    232    3            �            1259    144711    skillangels_games_entry_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_games_entry_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.skillangels_games_entry_seq;
       public       postgres    false    3            �            1259    144713    skillangels_games_entry    TABLE     �  CREATE TABLE public.skillangels_games_entry (
    games_entry_id text DEFAULT nextval('public.skillangels_games_entry_seq'::regclass) NOT NULL,
    user_id text NOT NULL,
    mem_game_id integer,
    vp_game_id integer,
    fa_game_id integer,
    ps_game_id integer,
    lin_game_id integer,
    event_id integer,
    current_year_status integer DEFAULT 1,
    date timestamp without time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP(0)),
    status integer DEFAULT 0 NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL,
    ass_status_id integer,
    mem_name text,
    vp_name text,
    fa_name text,
    ps_name text,
    lin_name text
);
 +   DROP TABLE public.skillangels_games_entry;
       public         postgres    false    234    3            �            1259    144724    skillangels_grade_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_grade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.skillangels_grade_id_seq;
       public       postgres    false    3            �            1259    144726    skillangels_grade    TABLE     V  CREATE TABLE public.skillangels_grade (
    id integer DEFAULT nextval('public.skillangels_grade_id_seq'::regclass) NOT NULL,
    gradename text NOT NULL,
    description text NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    created_by text NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    modified_by text NOT NULL,
    status integer NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL,
    grade text DEFAULT 1 NOT NULL
);
 %   DROP TABLE public.skillangels_grade;
       public         postgres    false    236    3            �            1259    144737 %   skillangels_gradecyclegame_gcg_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_gradecyclegame_gcg_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.skillangels_gradecyclegame_gcg_id_seq;
       public       postgres    false    3            �            1259    144739    skillangels_gradecyclegame    TABLE     4  CREATE TABLE public.skillangels_gradecyclegame (
    gcg_id text DEFAULT nextval('public.skillangels_gradecyclegame_gcg_id_seq'::regclass) NOT NULL,
    grade_id integer,
    cycle_id integer,
    assess_status_id integer,
    game_id integer,
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 .   DROP TABLE public.skillangels_gradecyclegame;
       public         postgres    false    238    3            �            1259    144747 "   skillangels_langconfig_lang_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_langconfig_lang_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.skillangels_langconfig_lang_id_seq;
       public       postgres    false    3            �            1259    144749    skillangels_langconfig    TABLE     R  CREATE TABLE public.skillangels_langconfig (
    lang_id integer DEFAULT nextval('public.skillangels_langconfig_lang_id_seq'::regclass) NOT NULL,
    lang_name character varying(50) NOT NULL,
    description character varying(355),
    original_name character varying(355),
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 *   DROP TABLE public.skillangels_langconfig;
       public         postgres    false    240    3            �            1259    144757    skillangels_loginlog_llid_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_loginlog_llid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.skillangels_loginlog_llid_seq;
       public       postgres    false    3            �            1259    144759    skillangels_loginlog    TABLE     �  CREATE TABLE public.skillangels_loginlog (
    llid text DEFAULT nextval('public.skillangels_loginlog_llid_seq'::regclass) NOT NULL,
    uid text,
    logindate date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date,
    logintime time without time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIME(0)),
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL,
    current_year_status integer DEFAULT 1
);
 (   DROP TABLE public.skillangels_loginlog;
       public         postgres    false    242    3            �            1259    144770 $   skillangels_musicconfig_music_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_musicconfig_music_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.skillangels_musicconfig_music_id_seq;
       public       postgres    false    3            �            1259    144772    skillangels_musicconfig    TABLE     -  CREATE TABLE public.skillangels_musicconfig (
    music_id integer DEFAULT nextval('public.skillangels_musicconfig_music_id_seq'::regclass) NOT NULL,
    music_name character varying(50) NOT NULL,
    description character varying(355),
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 +   DROP TABLE public.skillangels_musicconfig;
       public         postgres    false    244    3            �            1259    144777 %   skillangels_otherlang_words_ol_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_otherlang_words_ol_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.skillangels_otherlang_words_ol_id_seq;
       public       postgres    false    3            �            1259    144779    skillangels_otherlang_words    TABLE       CREATE TABLE public.skillangels_otherlang_words (
    ol_id integer DEFAULT nextval('public.skillangels_otherlang_words_ol_id_seq'::regclass) NOT NULL,
    lang_id integer,
    wordnum integer,
    ol_words text,
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 /   DROP TABLE public.skillangels_otherlang_words;
       public         postgres    false    246    3            �            1259    144787    skillangels_sbc_game    TABLE     �   CREATE TABLE public.skillangels_sbc_game (
    ssg_id integer DEFAULT nextval('public.sbc_game_ssg_id_seq'::regclass) NOT NULL,
    grade_id integer,
    game_id integer,
    status integer,
    sync_flag integer DEFAULT 1
);
 (   DROP TABLE public.skillangels_sbc_game;
       public         postgres    false    202    3            �            1259    144792    skillangels_scheme_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_scheme_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.skillangels_scheme_id_seq;
       public       postgres    false    3            �            1259    144794    skillangels_scheme    TABLE     2  CREATE TABLE public.skillangels_scheme (
    id integer DEFAULT nextval('public.skillangels_scheme_id_seq'::regclass) NOT NULL,
    scheme text NOT NULL,
    description text NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    created_by text NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    modified_by text NOT NULL,
    status integer NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public.skillangels_scheme;
       public         postgres    false    249    3            �            1259    144804    skillangels_school_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_school_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.skillangels_school_id_seq;
       public       postgres    false    3            �            1259    144806    skillangels_school    TABLE     <  CREATE TABLE public.skillangels_school (
    id integer DEFAULT nextval('public.skillangels_school_id_seq'::regclass) NOT NULL,
    schoolname text NOT NULL,
    address text NOT NULL,
    district text NOT NULL,
    state text NOT NULL,
    countryid integer NOT NULL,
    schoolcode text NOT NULL,
    logo_path text NOT NULL,
    schemeid integer NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    created_by text NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    modified_by text NOT NULL,
    status integer NOT NULL,
    branch_count integer NOT NULL,
    role integer NOT NULL,
    phoneno bigint NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public.skillangels_school;
       public         postgres    false    251    3            �            1259    144816 "   skillangels_school_holidays_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_school_holidays_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.skillangels_school_holidays_id_seq;
       public       postgres    false    3            �            1259    144818    skillangels_school_holidays    TABLE     �  CREATE TABLE public.skillangels_school_holidays (
    id text DEFAULT nextval('public.skillangels_school_holidays_id_seq'::regclass) NOT NULL,
    branch integer NOT NULL,
    holiday_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    holiday_description text NOT NULL,
    modified_by text NOT NULL,
    created_by text NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 /   DROP TABLE public.skillangels_school_holidays;
       public         postgres    false    253    3            �            1259    144829 !   skillangels_schoolacademic_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_schoolacademic_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.skillangels_schoolacademic_id_seq;
       public       postgres    false    3                        1259    144831    skillangels_schoolacademic    TABLE       CREATE TABLE public.skillangels_schoolacademic (
    id text DEFAULT nextval('public.skillangels_schoolacademic_id_seq'::regclass) NOT NULL,
    schoolid integer NOT NULL,
    startdate date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    enddate date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    created_by text NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    modified_by text NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL
);
 .   DROP TABLE public.skillangels_schoolacademic;
       public         postgres    false    255    3                       1259    144844    skillangels_schoolbranch_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_schoolbranch_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.skillangels_schoolbranch_id_seq;
       public       postgres    false    3                       1259    144846    skillangels_schoolbranch    TABLE     v  CREATE TABLE public.skillangels_schoolbranch (
    id integer DEFAULT nextval('public.skillangels_schoolbranch_id_seq'::regclass) NOT NULL,
    branchname text NOT NULL,
    address text NOT NULL,
    district text NOT NULL,
    state text NOT NULL,
    countryid integer NOT NULL,
    schoolcode text NOT NULL,
    logo_path text NOT NULL,
    branchcode text DEFAULT (('EDSIX00'::text || nextval('public.skillangels_schoolbranch_id_seq'::regclass)) || 'SA'::text) NOT NULL,
    schoolid integer NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    created_by text NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    modified_by text NOT NULL,
    status integer NOT NULL,
    mobileno bigint NOT NULL,
    timetablepattern integer NOT NULL,
    assessment_status integer,
    sync_flag integer DEFAULT 0 NOT NULL,
    lang_flag integer DEFAULT 0,
    total_time integer DEFAULT 0 NOT NULL,
    assessment_check integer DEFAULT 0 NOT NULL,
    rank_flag integer DEFAULT 1
);
 ,   DROP TABLE public.skillangels_schoolbranch;
       public         postgres    false    257    257    3                       1259    144861    skillangels_schoolday_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_schoolday_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.skillangels_schoolday_id_seq;
       public       postgres    false    3                       1259    144863    skillangels_schoolday    TABLE        CREATE TABLE public.skillangels_schoolday (
    id integer DEFAULT nextval('public.skillangels_schoolday_id_seq'::regclass) NOT NULL,
    day text NOT NULL,
    created_by text NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    modified_by text NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL
);
 )   DROP TABLE public.skillangels_schoolday;
       public         postgres    false    259    3                       1259    144874    skillangels_schoolgrade_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_schoolgrade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.skillangels_schoolgrade_id_seq;
       public       postgres    false    3                       1259    144876    skillangels_schoolgrade    TABLE       CREATE TABLE public.skillangels_schoolgrade (
    id text DEFAULT nextval('public.skillangels_schoolgrade_id_seq'::regclass) NOT NULL,
    branch_id integer NOT NULL,
    gradeid integer NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    created_by text NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    modified_by text NOT NULL,
    status integer NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL,
    medianval integer DEFAULT 40,
    mem_medianval integer DEFAULT 0,
    vp_medianval integer DEFAULT 0,
    fa_medianval integer DEFAULT 0,
    ps_medianval integer DEFAULT 0,
    lin_medianval integer DEFAULT 0
);
 +   DROP TABLE public.skillangels_schoolgrade;
       public         postgres    false    261    3                       1259    144892 &   skillangels_schoolgradesections_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_schoolgradesections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.skillangels_schoolgradesections_id_seq;
       public       postgres    false    3                       1259    144894    skillangels_schoolgradesections    TABLE     �  CREATE TABLE public.skillangels_schoolgradesections (
    id text DEFAULT nextval('public.skillangels_schoolgradesections_id_seq'::regclass) NOT NULL,
    branchid integer NOT NULL,
    gradeid text NOT NULL,
    sectionname text NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    created_by text NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    modified_by text NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL,
    daydata integer DEFAULT 0,
    startdate timestamp without time zone
);
 3   DROP TABLE public.skillangels_schoolgradesections;
       public         postgres    false    263    3            	           1259    144906    skillangels_schoolperiod_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_schoolperiod_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.skillangels_schoolperiod_id_seq;
       public       postgres    false    3            
           1259    144908    skillangels_schoolperiod    TABLE     i  CREATE TABLE public.skillangels_schoolperiod (
    id text DEFAULT nextval('public.skillangels_schoolperiod_id_seq'::regclass) NOT NULL,
    description text NOT NULL,
    branchid integer NOT NULL,
    period integer NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    created_by text NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    modified_by text NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    end_time time without time zone DEFAULT (timezone('Asia/Kolkata'::text, CURRENT_TIME(0)))::time without time zone NOT NULL,
    start_time time without time zone DEFAULT (timezone('Asia/Kolkata'::text, CURRENT_TIME(0)))::time without time zone NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL
);
 ,   DROP TABLE public.skillangels_schoolperiod;
       public         postgres    false    265    3                       1259    144921 "   skillangels_schooltimetable_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_schooltimetable_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.skillangels_schooltimetable_id_seq;
       public       postgres    false    3                       1259    144923    skillangels_schooltimetable    TABLE     �  CREATE TABLE public.skillangels_schooltimetable (
    id text DEFAULT nextval('public.skillangels_schooltimetable_id_seq'::regclass) NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    created_by text NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    modified_by text NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    sectionid text NOT NULL,
    periodid text NOT NULL,
    dayid integer NOT NULL,
    branchid integer NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL
);
 /   DROP TABLE public.skillangels_schooltimetable;
       public         postgres    false    267    3                       1259    144934    skillangels_sitewords_engid_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_sitewords_engid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.skillangels_sitewords_engid_seq;
       public       postgres    false    3                       1259    144936    skillangels_sitewords    TABLE     �   CREATE TABLE public.skillangels_sitewords (
    engid integer DEFAULT nextval('public.skillangels_sitewords_engid_seq'::regclass) NOT NULL,
    engword text,
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 )   DROP TABLE public.skillangels_sitewords;
       public         postgres    false    269    3                       1259    144944    skillangels_skill_skill_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_skill_skill_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.skillangels_skill_skill_id_seq;
       public       postgres    false    3                       1259    144946    skillangels_skill    TABLE       CREATE TABLE public.skillangels_skill (
    skill_id integer DEFAULT nextval('public.skillangels_skill_skill_id_seq'::regclass) NOT NULL,
    skillname character varying(355),
    skilldescription character varying(355),
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 %   DROP TABLE public.skillangels_skill;
       public         postgres    false    271    3                       1259    144954 %   skillangels_skillkit_games_skg_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_skillkit_games_skg_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.skillangels_skillkit_games_skg_id_seq;
       public       postgres    false    3                       1259    144956    skillangels_skillkit_games    TABLE       CREATE TABLE public.skillangels_skillkit_games (
    skg_id integer DEFAULT nextval('public.skillangels_skillkit_games_skg_id_seq'::regclass) NOT NULL,
    grade_id integer,
    game_id integer,
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 .   DROP TABLE public.skillangels_skillkit_games;
       public         postgres    false    273    3                       1259    144961 %   skillangels_skillkit_usermaxscore_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_skillkit_usermaxscore_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.skillangels_skillkit_usermaxscore_seq;
       public       postgres    false    3                       1259    144963 !   skillangels_skillkit_usermaxscore    TABLE     R  CREATE TABLE public.skillangels_skillkit_usermaxscore (
    skillkit_ums_id text DEFAULT nextval('public.skillangels_skillkit_usermaxscore_seq'::regclass) NOT NULL,
    user_id text NOT NULL,
    cycle_id integer DEFAULT 1,
    skillkit integer,
    max_m_score integer,
    max_v_score integer,
    max_f_score integer,
    max_p_score integer,
    max_l_score integer,
    status integer DEFAULT 1,
    played_date timestamp without time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP(0)),
    sync_flag integer DEFAULT 0 NOT NULL,
    current_year_status integer DEFAULT 1
);
 5   DROP TABLE public.skillangels_skillkit_usermaxscore;
       public         postgres    false    275    3                       1259    144975 )   skillangels_skillkitgames_cylce_entry_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_skillkitgames_cylce_entry_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 @   DROP SEQUENCE public.skillangels_skillkitgames_cylce_entry_seq;
       public       postgres    false    3                       1259    144977 %   skillangels_skillkitgames_cylce_entry    TABLE     8  CREATE TABLE public.skillangels_skillkitgames_cylce_entry (
    skillkitgames_cycle_entry_id text DEFAULT nextval('public.skillangels_skillkitgames_cylce_entry_seq'::regclass) NOT NULL,
    user_id text NOT NULL,
    mem_game_id integer,
    vp_game_id integer,
    fa_game_id integer,
    ps_game_id integer,
    lin_game_id integer,
    mem_name text,
    vp_name text,
    fa_name text,
    ps_name text,
    lin_name text,
    ass_status_id integer,
    event_id integer,
    current_year_status integer DEFAULT 1,
    actual_start_date timestamp without time zone,
    actual_end_date timestamp without time zone,
    played_start_date timestamp without time zone,
    played_end_date timestamp without time zone,
    status integer DEFAULT 0 NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL,
    skillcnt integer
);
 9   DROP TABLE public.skillangels_skillkitgames_cylce_entry;
       public         postgres    false    277    3                       1259    144987 (   skillangels_skillkitscore_skscore_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_skillkitscore_skscore_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.skillangels_skillkitscore_skscore_id_seq;
       public       postgres    false    3                       1259    144989    skillangels_skillkitscore    TABLE     �  CREATE TABLE public.skillangels_skillkitscore (
    skscore_id text DEFAULT nextval('public.skillangels_skillkitscore_skscore_id_seq'::regclass) NOT NULL,
    user_id text,
    game_id integer,
    event_id integer,
    score integer,
    correctcnt integer,
    wrongcnt integer,
    ansquescnt integer,
    totalquescnt integer,
    responsetime integer,
    wrongresponsetime integer,
    correctresponsetime integer,
    gametime integer,
    played_date timestamp without time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP(0)),
    skillkit integer,
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL,
    current_year_status integer DEFAULT 1,
    testtype integer
);
 -   DROP TABLE public.skillangels_skillkitscore;
       public         postgres    false    279    3                       1259    144999 $   skillangels_themeconfig_theme_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_themeconfig_theme_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.skillangels_themeconfig_theme_id_seq;
       public       postgres    false    3                       1259    145001    skillangels_themeconfig    TABLE     F  CREATE TABLE public.skillangels_themeconfig (
    theme_id integer DEFAULT nextval('public.skillangels_themeconfig_theme_id_seq'::regclass) NOT NULL,
    theme_name character varying(50) NOT NULL,
    description character varying(355),
    theme_score integer,
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL
);
 +   DROP TABLE public.skillangels_themeconfig;
       public         postgres    false    281    3                       1259    145006 "   skillangels_train_userscore_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_train_userscore_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.skillangels_train_userscore_id_seq;
       public       postgres    false    3                       1259    145008    training_gameques_entry    SEQUENCE     �   CREATE SEQUENCE public.training_gameques_entry
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.training_gameques_entry;
       public       postgres    false    3                       1259    145010 #   skillangels_training_gameques_entry    TABLE     a  CREATE TABLE public.skillangels_training_gameques_entry (
    gameques_train_id text DEFAULT nextval('public.training_gameques_entry'::regclass) NOT NULL,
    user_id text,
    game_id integer,
    event_id integer,
    quesno integer,
    score integer,
    ansvalidation character varying(50),
    responsetime integer,
    answeredtime timestamp without time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP(0)),
    ass_status_id integer,
    finish_status integer DEFAULT 0 NOT NULL,
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL,
    current_year_status integer DEFAULT 1
);
 7   DROP TABLE public.skillangels_training_gameques_entry;
       public         postgres    false    284    3                       1259    145021    skillangels_training_userscore    TABLE     �  CREATE TABLE public.skillangels_training_userscore (
    userscore_train_id text DEFAULT nextval('public.skillangels_train_userscore_id_seq'::regclass) NOT NULL,
    user_id text,
    game_id integer,
    event_id integer,
    score integer,
    correctcnt integer,
    wrongcnt integer,
    ansquescnt integer,
    totalquescnt integer,
    responsetime integer,
    wrongresponsetime integer,
    correctresponsetime integer,
    gametime integer,
    date timestamp without time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP(0)),
    status integer,
    ass_status_id integer,
    ass_slot integer,
    sync_flag integer DEFAULT 0 NOT NULL,
    current_year_status integer DEFAULT 1
);
 2   DROP TABLE public.skillangels_training_userscore;
       public         postgres    false    283    3                       1259    145031 &   skillangels_userfinishcycle_ufc_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_userfinishcycle_ufc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.skillangels_userfinishcycle_ufc_id_seq;
       public       postgres    false    3                        1259    145033    skillangels_userfinishcycle    TABLE     �  CREATE TABLE public.skillangels_userfinishcycle (
    ufc_id text DEFAULT nextval('public.skillangels_userfinishcycle_ufc_id_seq'::regclass) NOT NULL,
    user_id text,
    cycle_id integer DEFAULT 1,
    assess_status_id integer,
    m_score integer,
    v_score integer,
    f_score integer,
    p_score integer,
    l_score integer,
    m_attempt_cnt integer,
    v_attempt_cnt integer,
    f_attempt_cnt integer,
    p_attempt_cnt integer,
    l_attempt_cnt integer,
    date timestamp without time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP(0)),
    status integer DEFAULT 1,
    sync_flag integer DEFAULT 0 NOT NULL,
    current_year_status integer DEFAULT 1
);
 /   DROP TABLE public.skillangels_userfinishcycle;
       public         postgres    false    287    3            !           1259    145045    skillangels_usermaxscore_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_usermaxscore_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.skillangels_usermaxscore_id_seq;
       public       postgres    false    3            "           1259    145047    skillangels_usermaxscore    TABLE     2  CREATE TABLE public.skillangels_usermaxscore (
    ums_id text DEFAULT nextval('public.skillangels_usermaxscore_id_seq'::regclass) NOT NULL,
    user_id text,
    cycle_id integer DEFAULT 1,
    assess_status_id integer,
    max_m_score integer,
    max_v_score integer,
    max_f_score integer,
    max_p_score integer,
    max_l_score integer,
    status integer DEFAULT 1,
    date timestamp without time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP(0)),
    sync_flag integer DEFAULT 0 NOT NULL,
    current_year_status integer DEFAULT 1
);
 ,   DROP TABLE public.skillangels_usermaxscore;
       public         postgres    false    289    3            #           1259    145059    skillangels_userrole_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_userrole_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.skillangels_userrole_id_seq;
       public       postgres    false    3            $           1259    145061    skillangels_userrole    TABLE     4  CREATE TABLE public.skillangels_userrole (
    id integer DEFAULT nextval('public.skillangels_userrole_id_seq'::regclass) NOT NULL,
    role text NOT NULL,
    description text NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    created_by text NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    modified_by text NOT NULL,
    status integer NOT NULL,
    sync_flag integer DEFAULT 0 NOT NULL
);
 (   DROP TABLE public.skillangels_userrole;
       public         postgres    false    291    3            %           1259    145071    skillangels_users    TABLE     !  CREATE TABLE public.skillangels_users (
    id text DEFAULT nextval('public.skillangel_users_id_seq'::regclass) NOT NULL,
    user_name text NOT NULL,
    password text NOT NULL,
    dob date NOT NULL,
    contact_no bigint NOT NULL,
    modified_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    modified_by text NOT NULL,
    created_by text NOT NULL,
    created_date date DEFAULT (timezone('Asia/Kolkata'::text, (CURRENT_DATE)::timestamp with time zone))::date NOT NULL,
    branch_id integer NOT NULL,
    email text NOT NULL,
    address text NOT NULL,
    district text NOT NULL,
    state text NOT NULL,
    section_id text NOT NULL,
    assessment_status integer DEFAULT 0,
    selected_lang integer DEFAULT 1 NOT NULL,
    selected_theme integer DEFAULT 1 NOT NULL,
    selected_music integer DEFAULT 1 NOT NULL,
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL,
    isskillkit integer DEFAULT 0,
    played_time integer DEFAULT 0 NOT NULL,
    current_year_status integer DEFAULT 1,
    dob_password text DEFAULT 'skillangels'::text NOT NULL,
    name character varying DEFAULT 'Demo'::character varying NOT NULL,
    current_session_id text,
    rule_flag integer DEFAULT 0 NOT NULL,
    profile_img_name integer DEFAULT 1
);
 %   DROP TABLE public.skillangels_users;
       public         postgres    false    207    3            &           1259    145092 &   skillangels_userscore_userscore_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_userscore_userscore_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.skillangels_userscore_userscore_id_seq;
       public       postgres    false    3            '           1259    145094    skillangels_userscore    TABLE     �  CREATE TABLE public.skillangels_userscore (
    userscore_id text DEFAULT nextval('public.skillangels_userscore_userscore_id_seq'::regclass) NOT NULL,
    user_id text,
    game_id integer,
    event_id integer,
    score integer,
    correctcnt integer,
    wrongcnt integer,
    ansquescnt integer,
    totalquescnt integer,
    responsetime integer,
    wrongresponsetime integer,
    correctresponsetime integer,
    gametime integer,
    date timestamp without time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP(0)),
    status integer,
    ass_status_id integer,
    ass_slot integer,
    sync_flag integer DEFAULT 0 NOT NULL,
    current_year_status integer DEFAULT 1
);
 )   DROP TABLE public.skillangels_userscore;
       public         postgres    false    294    3            (           1259    145104 %   skillangels_usertotalvalue_utv_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skillangels_usertotalvalue_utv_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.skillangels_usertotalvalue_utv_id_seq;
       public       postgres    false    3            )           1259    145106    skillangels_usertotalvalue    TABLE     �  CREATE TABLE public.skillangels_usertotalvalue (
    utv_id text DEFAULT nextval('public.skillangels_usertotalvalue_utv_id_seq'::regclass) NOT NULL,
    user_id text,
    totalscore integer DEFAULT 0,
    totalstar integer DEFAULT 0,
    totalcrowny integer DEFAULT 0,
    date timestamp without time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP(0)),
    status integer,
    sync_flag integer DEFAULT 0 NOT NULL,
    current_year_status integer DEFAULT 1
);
 .   DROP TABLE public.skillangels_usertotalvalue;
       public         postgres    false    296    3            *           1259    145119    user_login_status    TABLE     �   CREATE TABLE public.user_login_status (
    id integer NOT NULL,
    uname character varying(50) NOT NULL,
    grade character varying(50) NOT NULL,
    status integer NOT NULL,
    msg text NOT NULL,
    branch_id integer
);
 %   DROP TABLE public.user_login_status;
       public         postgres    false    3            +           1259    145125    user_login_status_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_login_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.user_login_status_id_seq;
       public       postgres    false    3    298            �           0    0    user_login_status_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.user_login_status_id_seq OWNED BY public.user_login_status.id;
            public       postgres    false    299                       2604    145127    school_config id    DEFAULT     t   ALTER TABLE ONLY public.school_config ALTER COLUMN id SET DEFAULT nextval('public.school_config_id_seq'::regclass);
 ?   ALTER TABLE public.school_config ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    204    203            %           2604    145128    skillangels_eod_mail_log id    DEFAULT     �   ALTER TABLE ONLY public.skillangels_eod_mail_log ALTER COLUMN id SET DEFAULT nextval('public.skillangels_eod_mail_log_id_seq'::regclass);
 J   ALTER TABLE public.skillangels_eod_mail_log ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    224    223            �           2604    145129    user_login_status id    DEFAULT     |   ALTER TABLE ONLY public.user_login_status ALTER COLUMN id SET DEFAULT nextval('public.user_login_status_id_seq'::regclass);
 C   ALTER TABLE public.user_login_status ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    299    298            D          0    144530    config 
   TABLE DATA               _   COPY public.config (id, configname, configvalue, description, status, "Sync_Flag") FROM stdin;
    public       postgres    false    197   ��      F          0    144541    country_timezone 
   TABLE DATA               `   COPY public.country_timezone (id, countryname, timezone, status, timing, sync_flag) FROM stdin;
    public       postgres    false    199   �      J          0    144555    school_config 
   TABLE DATA               \   COPY public.school_config (id, branch_id, isemailneed, maildays, "to", emailcc) FROM stdin;
    public       postgres    false    203   1�      M          0    144565    schoolconfig 
   TABLE DATA               m   COPY public.schoolconfig (id, schoolid, configname, configvalue, description, status, sync_flag) FROM stdin;
    public       postgres    false    206   N�      P          0    144578    skillangels_admin 
   TABLE DATA               �   COPY public.skillangels_admin (id, username, emailid, mobileno, password, roleid, created_date, created_by, modified_date, modified_by, status, branch_id, school_id, sync_flag) FROM stdin;
    public       postgres    false    209   k�      R          0    144590    skillangels_assessment 
   TABLE DATA               f   COPY public.skillangels_assessment (assessid, assessname, description, status, sync_flag) FROM stdin;
    public       postgres    false    211   ��      T          0    144597    skillangels_assessment_status 
   TABLE DATA               �   COPY public.skillangels_assessment_status (assess_status_id, assessment_status_name, assessment_status_des, status, sync_flag) FROM stdin;
    public       postgres    false    213   ��      V          0    144604    skillangels_branch_installation 
   TABLE DATA               [   COPY public.skillangels_branch_installation (id, branch_id, ipaddress, status) FROM stdin;
    public       postgres    false    215         X          0    144614     skillangels_branchgradecyclegame 
   TABLE DATA               i   COPY public.skillangels_branchgradecyclegame (bgcg_id, branch_id, gcg_id, status, sync_flag) FROM stdin;
    public       postgres    false    217   ߝ      Y          0    144622    skillangels_crownylog 
   TABLE DATA               �   COPY public.skillangels_crownylog (culogid, uid, crowny, addeddate, status, sync_flag, reason, addedtime, current_year_status) FROM stdin;
    public       postgres    false    218   ��      [          0    144635    skillangels_current_server 
   TABLE DATA               W   COPY public.skillangels_current_server (id, branch_id, servername, status) FROM stdin;
    public       postgres    false    220   �      ]          0    144645    skillangels_cycle 
   TABLE DATA               e   COPY public.skillangels_cycle (cycle_id, cyclename, cycledescription, status, sync_flag) FROM stdin;
    public       postgres    false    222   6�      ^          0    144653    skillangels_eod_mail_log 
   TABLE DATA               R   COPY public.skillangels_eod_mail_log (id, branch_id, sent_on, status) FROM stdin;
    public       postgres    false    223   S�      a          0    144660    skillangels_event 
   TABLE DATA               e   COPY public.skillangels_event (event_id, eventname, eventdescription, status, sync_flag) FROM stdin;
    public       postgres    false    226   p�      c          0    144670    skillangels_feedback 
   TABLE DATA               �   COPY public.skillangels_feedback (sf_id, user_id, assessment_experience, how_to_play_instruction, about_program, solve_puzzles, share_assessment_experience, description, status, sync_flag, current_year_status) FROM stdin;
    public       postgres    false    228   ��      e          0    144680    skillangels_gamemaster 
   TABLE DATA               q   COPY public.skillangels_gamemaster (game_id, skill_id, gamename, gamedescription, status, sync_flag) FROM stdin;
    public       postgres    false    230   ��      f          0    144688    skillangels_gameques_entry 
   TABLE DATA               �   COPY public.skillangels_gameques_entry (gameques_id, user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status, status, sync_flag, current_year_status) FROM stdin;
    public       postgres    false    231   Ǟ      h          0    144701    skillangels_games_cylce_entry 
   TABLE DATA               L  COPY public.skillangels_games_cylce_entry (games_cycle_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, status, sync_flag) FROM stdin;
    public       postgres    false    233   �      j          0    144713    skillangels_games_entry 
   TABLE DATA               �   COPY public.skillangels_games_entry (games_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, event_id, current_year_status, date, status, sync_flag, ass_status_id, mem_name, vp_name, fa_name, ps_name, lin_name) FROM stdin;
    public       postgres    false    235   �      l          0    144726    skillangels_grade 
   TABLE DATA               �   COPY public.skillangels_grade (id, gradename, description, created_date, created_by, modified_date, modified_by, status, sync_flag, grade) FROM stdin;
    public       postgres    false    237   �      n          0    144739    skillangels_gradecyclegame 
   TABLE DATA               ~   COPY public.skillangels_gradecyclegame (gcg_id, grade_id, cycle_id, assess_status_id, game_id, status, sync_flag) FROM stdin;
    public       postgres    false    239   ;�      p          0    144749    skillangels_langconfig 
   TABLE DATA               s   COPY public.skillangels_langconfig (lang_id, lang_name, description, original_name, status, sync_flag) FROM stdin;
    public       postgres    false    241   X�      r          0    144759    skillangels_loginlog 
   TABLE DATA               w   COPY public.skillangels_loginlog (llid, uid, logindate, logintime, status, sync_flag, current_year_status) FROM stdin;
    public       postgres    false    243   u�      t          0    144772    skillangels_musicconfig 
   TABLE DATA               g   COPY public.skillangels_musicconfig (music_id, music_name, description, status, sync_flag) FROM stdin;
    public       postgres    false    245   ��      v          0    144779    skillangels_otherlang_words 
   TABLE DATA               k   COPY public.skillangels_otherlang_words (ol_id, lang_id, wordnum, ol_words, status, sync_flag) FROM stdin;
    public       postgres    false    247   ��      w          0    144787    skillangels_sbc_game 
   TABLE DATA               \   COPY public.skillangels_sbc_game (ssg_id, grade_id, game_id, status, sync_flag) FROM stdin;
    public       postgres    false    248   ̟      y          0    144794    skillangels_scheme 
   TABLE DATA               �   COPY public.skillangels_scheme (id, scheme, description, created_date, created_by, modified_date, modified_by, status, sync_flag) FROM stdin;
    public       postgres    false    250   �      {          0    144806    skillangels_school 
   TABLE DATA               �   COPY public.skillangels_school (id, schoolname, address, district, state, countryid, schoolcode, logo_path, schemeid, created_date, created_by, modified_date, modified_by, status, branch_count, role, phoneno, sync_flag) FROM stdin;
    public       postgres    false    252   �      }          0    144818    skillangels_school_holidays 
   TABLE DATA               �   COPY public.skillangels_school_holidays (id, branch, holiday_date, holiday_description, modified_by, created_by, modified_date, created_date, status, sync_flag) FROM stdin;
    public       postgres    false    254   #�                0    144831    skillangels_schoolacademic 
   TABLE DATA               �   COPY public.skillangels_schoolacademic (id, schoolid, startdate, enddate, created_date, created_by, modified_date, modified_by, status, sync_flag) FROM stdin;
    public       postgres    false    256   @�      �          0    144846    skillangels_schoolbranch 
   TABLE DATA               @  COPY public.skillangels_schoolbranch (id, branchname, address, district, state, countryid, schoolcode, logo_path, branchcode, schoolid, created_date, created_by, modified_date, modified_by, status, mobileno, timetablepattern, assessment_status, sync_flag, lang_flag, total_time, assessment_check, rank_flag) FROM stdin;
    public       postgres    false    258   ]�      �          0    144863    skillangels_schoolday 
   TABLE DATA               �   COPY public.skillangels_schoolday (id, day, created_by, created_date, modified_by, modified_date, status, sync_flag) FROM stdin;
    public       postgres    false    260   z�      �          0    144876    skillangels_schoolgrade 
   TABLE DATA               �   COPY public.skillangels_schoolgrade (id, branch_id, gradeid, created_date, created_by, modified_date, modified_by, status, sync_flag, medianval, mem_medianval, vp_medianval, fa_medianval, ps_medianval, lin_medianval) FROM stdin;
    public       postgres    false    262   ��      �          0    144894    skillangels_schoolgradesections 
   TABLE DATA               �   COPY public.skillangels_schoolgradesections (id, branchid, gradeid, sectionname, created_date, created_by, modified_date, modified_by, status, sync_flag, daydata, startdate) FROM stdin;
    public       postgres    false    264   ��      �          0    144908    skillangels_schoolperiod 
   TABLE DATA               �   COPY public.skillangels_schoolperiod (id, description, branchid, period, created_date, created_by, modified_date, modified_by, status, end_time, start_time, sync_flag) FROM stdin;
    public       postgres    false    266   Ѡ      �          0    144923    skillangels_schooltimetable 
   TABLE DATA               �   COPY public.skillangels_schooltimetable (id, created_date, created_by, modified_date, modified_by, status, sectionid, periodid, dayid, branchid, sync_flag) FROM stdin;
    public       postgres    false    268   �      �          0    144936    skillangels_sitewords 
   TABLE DATA               R   COPY public.skillangels_sitewords (engid, engword, status, sync_flag) FROM stdin;
    public       postgres    false    270   �      �          0    144946    skillangels_skill 
   TABLE DATA               e   COPY public.skillangels_skill (skill_id, skillname, skilldescription, status, sync_flag) FROM stdin;
    public       postgres    false    272   (�      �          0    144956    skillangels_skillkit_games 
   TABLE DATA               b   COPY public.skillangels_skillkit_games (skg_id, grade_id, game_id, status, sync_flag) FROM stdin;
    public       postgres    false    274   E�      �          0    144963 !   skillangels_skillkit_usermaxscore 
   TABLE DATA               �   COPY public.skillangels_skillkit_usermaxscore (skillkit_ums_id, user_id, cycle_id, skillkit, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, status, played_date, sync_flag, current_year_status) FROM stdin;
    public       postgres    false    276   b�      �          0    144977 %   skillangels_skillkitgames_cylce_entry 
   TABLE DATA               f  COPY public.skillangels_skillkitgames_cylce_entry (skillkitgames_cycle_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, status, sync_flag, skillcnt) FROM stdin;
    public       postgres    false    278   �      �          0    144989    skillangels_skillkitscore 
   TABLE DATA                 COPY public.skillangels_skillkitscore (skscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, played_date, skillkit, status, sync_flag, current_year_status, testtype) FROM stdin;
    public       postgres    false    280   ��      �          0    145001    skillangels_themeconfig 
   TABLE DATA               t   COPY public.skillangels_themeconfig (theme_id, theme_name, description, theme_score, status, sync_flag) FROM stdin;
    public       postgres    false    282   ��      �          0    145010 #   skillangels_training_gameques_entry 
   TABLE DATA               �   COPY public.skillangels_training_gameques_entry (gameques_train_id, user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status, status, sync_flag, current_year_status) FROM stdin;
    public       postgres    false    285   ֡      �          0    145021    skillangels_training_userscore 
   TABLE DATA               &  COPY public.skillangels_training_userscore (userscore_train_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, date, status, ass_status_id, ass_slot, sync_flag, current_year_status) FROM stdin;
    public       postgres    false    286   �      �          0    145033    skillangels_userfinishcycle 
   TABLE DATA                 COPY public.skillangels_userfinishcycle (ufc_id, user_id, cycle_id, assess_status_id, m_score, v_score, f_score, p_score, l_score, m_attempt_cnt, v_attempt_cnt, f_attempt_cnt, p_attempt_cnt, l_attempt_cnt, date, status, sync_flag, current_year_status) FROM stdin;
    public       postgres    false    288   �      �          0    145047    skillangels_usermaxscore 
   TABLE DATA               �   COPY public.skillangels_usermaxscore (ums_id, user_id, cycle_id, assess_status_id, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, status, date, sync_flag, current_year_status) FROM stdin;
    public       postgres    false    290   -�      �          0    145061    skillangels_userrole 
   TABLE DATA               �   COPY public.skillangels_userrole (id, role, description, created_date, created_by, modified_date, modified_by, status, sync_flag) FROM stdin;
    public       postgres    false    292   J�      �          0    145071    skillangels_users 
   TABLE DATA               �  COPY public.skillangels_users (id, user_name, password, dob, contact_no, modified_date, modified_by, created_by, created_date, branch_id, email, address, district, state, section_id, assessment_status, selected_lang, selected_theme, selected_music, status, sync_flag, isskillkit, played_time, current_year_status, dob_password, name, current_session_id, rule_flag, profile_img_name) FROM stdin;
    public       postgres    false    293   g�      �          0    145094    skillangels_userscore 
   TABLE DATA                 COPY public.skillangels_userscore (userscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, date, status, ass_status_id, ass_slot, sync_flag, current_year_status) FROM stdin;
    public       postgres    false    295   ��      �          0    145106    skillangels_usertotalvalue 
   TABLE DATA               �   COPY public.skillangels_usertotalvalue (utv_id, user_id, totalscore, totalstar, totalcrowny, date, status, sync_flag, current_year_status) FROM stdin;
    public       postgres    false    297   ��      �          0    145119    user_login_status 
   TABLE DATA               U   COPY public.user_login_status (id, uname, grade, status, msg, branch_id) FROM stdin;
    public       postgres    false    298   ��      �           0    0    config_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.config_id_seq', 1, false);
            public       postgres    false    196            �           0    0    country_timezone_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.country_timezone_id_seq', 1, true);
            public       postgres    false    198            �           0    0    crownylog_culogid_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.crownylog_culogid_seq', 50795, true);
            public       postgres    false    200            �           0    0    gameques_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.gameques_id_seq', 478470, true);
            public       postgres    false    201            �           0    0    sbc_game_ssg_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.sbc_game_ssg_id_seq', 1, false);
            public       postgres    false    202            �           0    0    school_config_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.school_config_id_seq', 7, true);
            public       postgres    false    204            �           0    0    schoolconfig_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.schoolconfig_id_seq', 1, false);
            public       postgres    false    205            �           0    0    skillangel_users_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.skillangel_users_id_seq', 16436, true);
            public       postgres    false    207            �           0    0    skillangels_admins_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.skillangels_admins_id_seq', 43, true);
            public       postgres    false    208            �           0    0 #   skillangels_assessment_assessid_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.skillangels_assessment_assessid_seq', 3, true);
            public       postgres    false    210            �           0    0 2   skillangels_assessment_status_assess_status_id_seq    SEQUENCE SET     `   SELECT pg_catalog.setval('public.skillangels_assessment_status_assess_status_id_seq', 3, true);
            public       postgres    false    212            �           0    0 "   skillangels_branch_installation_id    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.skillangels_branch_installation_id', 26, true);
            public       postgres    false    214            �           0    0 ,   skillangels_branchgradecyclegame_bgcg_id_seq    SEQUENCE SET     ]   SELECT pg_catalog.setval('public.skillangels_branchgradecyclegame_bgcg_id_seq', 7821, true);
            public       postgres    false    216            �           0    0    skillangels_current_server_id    SEQUENCE SET     L   SELECT pg_catalog.setval('public.skillangels_current_server_id', 30, true);
            public       postgres    false    219            �           0    0    skillangels_cycle_cycle_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.skillangels_cycle_cycle_id_seq', 1, true);
            public       postgres    false    221            �           0    0    skillangels_eod_mail_log_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.skillangels_eod_mail_log_id_seq', 110, true);
            public       postgres    false    224            �           0    0    skillangels_event_event_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.skillangels_event_event_id_seq', 1, true);
            public       postgres    false    225            �           0    0    skillangels_feedback_seqid    SEQUENCE SET     K   SELECT pg_catalog.setval('public.skillangels_feedback_seqid', 1057, true);
            public       postgres    false    227            �           0    0 "   skillangels_gamemaster_game_id_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.skillangels_gamemaster_game_id_seq', 399, false);
            public       postgres    false    229            �           0    0 !   skillangels_games_cylce_entry_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.skillangels_games_cylce_entry_seq', 3244, true);
            public       postgres    false    232            �           0    0    skillangels_games_entry_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.skillangels_games_entry_seq', 3148, true);
            public       postgres    false    234            �           0    0    skillangels_grade_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.skillangels_grade_id_seq', 12, true);
            public       postgres    false    236            �           0    0 %   skillangels_gradecyclegame_gcg_id_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('public.skillangels_gradecyclegame_gcg_id_seq', 810, true);
            public       postgres    false    238            �           0    0 "   skillangels_langconfig_lang_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.skillangels_langconfig_lang_id_seq', 4, true);
            public       postgres    false    240            �           0    0    skillangels_loginlog_llid_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.skillangels_loginlog_llid_seq', 28327, true);
            public       postgres    false    242            �           0    0 $   skillangels_musicconfig_music_id_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.skillangels_musicconfig_music_id_seq', 6, true);
            public       postgres    false    244            �           0    0 %   skillangels_otherlang_words_ol_id_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.skillangels_otherlang_words_ol_id_seq', 1, false);
            public       postgres    false    246            �           0    0    skillangels_scheme_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.skillangels_scheme_id_seq', 3, true);
            public       postgres    false    249            �           0    0 "   skillangels_school_holidays_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.skillangels_school_holidays_id_seq', 14, true);
            public       postgres    false    253            �           0    0    skillangels_school_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.skillangels_school_id_seq', 167, true);
            public       postgres    false    251            �           0    0 !   skillangels_schoolacademic_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.skillangels_schoolacademic_id_seq', 1, true);
            public       postgres    false    255            �           0    0    skillangels_schoolbranch_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.skillangels_schoolbranch_id_seq', 146, true);
            public       postgres    false    257            �           0    0    skillangels_schoolday_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.skillangels_schoolday_id_seq', 7, true);
            public       postgres    false    259            �           0    0    skillangels_schoolgrade_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.skillangels_schoolgrade_id_seq', 200, true);
            public       postgres    false    261            �           0    0 &   skillangels_schoolgradesections_id_seq    SEQUENCE SET     V   SELECT pg_catalog.setval('public.skillangels_schoolgradesections_id_seq', 370, true);
            public       postgres    false    263            �           0    0    skillangels_schoolperiod_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.skillangels_schoolperiod_id_seq', 21, true);
            public       postgres    false    265            �           0    0 "   skillangels_schooltimetable_id_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.skillangels_schooltimetable_id_seq', 191, true);
            public       postgres    false    267            �           0    0    skillangels_sitewords_engid_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.skillangels_sitewords_engid_seq', 52, true);
            public       postgres    false    269            �           0    0    skillangels_skill_skill_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.skillangels_skill_skill_id_seq', 5, true);
            public       postgres    false    271            �           0    0 %   skillangels_skillkit_games_skg_id_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.skillangels_skillkit_games_skg_id_seq', 80, true);
            public       postgres    false    273            �           0    0 %   skillangels_skillkit_usermaxscore_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.skillangels_skillkit_usermaxscore_seq', 1, false);
            public       postgres    false    275            �           0    0 )   skillangels_skillkitgames_cylce_entry_seq    SEQUENCE SET     X   SELECT pg_catalog.setval('public.skillangels_skillkitgames_cylce_entry_seq', 1, false);
            public       postgres    false    277            �           0    0 (   skillangels_skillkitscore_skscore_id_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.skillangels_skillkitscore_skscore_id_seq', 1, false);
            public       postgres    false    279            �           0    0 $   skillangels_themeconfig_theme_id_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.skillangels_themeconfig_theme_id_seq', 10, true);
            public       postgres    false    281            �           0    0 "   skillangels_train_userscore_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.skillangels_train_userscore_id_seq', 1, false);
            public       postgres    false    283            �           0    0 &   skillangels_userfinishcycle_ufc_id_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.skillangels_userfinishcycle_ufc_id_seq', 2820, true);
            public       postgres    false    287            �           0    0    skillangels_usermaxscore_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.skillangels_usermaxscore_id_seq', 2819, true);
            public       postgres    false    289            �           0    0    skillangels_userrole_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.skillangels_userrole_id_seq', 4, true);
            public       postgres    false    291            �           0    0 &   skillangels_userscore_userscore_id_seq    SEQUENCE SET     X   SELECT pg_catalog.setval('public.skillangels_userscore_userscore_id_seq', 48365, true);
            public       postgres    false    294            �           0    0 %   skillangels_usertotalvalue_utv_id_seq    SEQUENCE SET     V   SELECT pg_catalog.setval('public.skillangels_usertotalvalue_utv_id_seq', 2696, true);
            public       postgres    false    296            �           0    0    training_gameques_entry    SEQUENCE SET     F   SELECT pg_catalog.setval('public.training_gameques_entry', 1, false);
            public       postgres    false    284            �           0    0    user_login_status_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.user_login_status_id_seq', 10723, true);
            public       postgres    false    299            �           2606    145131    config config_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.config
    ADD CONSTRAINT config_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.config DROP CONSTRAINT config_pkey;
       public         postgres    false    197            �           2606    145133 &   country_timezone country_timezone_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.country_timezone
    ADD CONSTRAINT country_timezone_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.country_timezone DROP CONSTRAINT country_timezone_pkey;
       public         postgres    false    199            �           2606    145135 $   skillangels_crownylog crownylog_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.skillangels_crownylog
    ADD CONSTRAINT crownylog_pkey PRIMARY KEY (culogid);
 N   ALTER TABLE ONLY public.skillangels_crownylog DROP CONSTRAINT crownylog_pkey;
       public         postgres    false    218            �           2606    145137     school_config school_config_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.school_config
    ADD CONSTRAINT school_config_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.school_config DROP CONSTRAINT school_config_pkey;
       public         postgres    false    203            �           2606    145139    schoolconfig schoolconfig_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.schoolconfig
    ADD CONSTRAINT schoolconfig_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.schoolconfig DROP CONSTRAINT schoolconfig_pkey;
       public         postgres    false    206            G           2606    145141 '   skillangels_users skillangel_users_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.skillangels_users
    ADD CONSTRAINT skillangel_users_pkey PRIMARY KEY (id);
 Q   ALTER TABLE ONLY public.skillangels_users DROP CONSTRAINT skillangel_users_pkey;
       public         postgres    false    293            �           2606    145143 0   skillangels_admin skillangels_admin_username_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.skillangels_admin
    ADD CONSTRAINT skillangels_admin_username_key UNIQUE (username);
 Z   ALTER TABLE ONLY public.skillangels_admin DROP CONSTRAINT skillangels_admin_username_key;
       public         postgres    false    209            �           2606    145145 0   skillangels_admin skillangels_admins_emailid_key 
   CONSTRAINT     n   ALTER TABLE ONLY public.skillangels_admin
    ADD CONSTRAINT skillangels_admins_emailid_key UNIQUE (emailid);
 Z   ALTER TABLE ONLY public.skillangels_admin DROP CONSTRAINT skillangels_admins_emailid_key;
       public         postgres    false    209            �           2606    145147 1   skillangels_admin skillangels_admins_mobileno_key 
   CONSTRAINT     p   ALTER TABLE ONLY public.skillangels_admin
    ADD CONSTRAINT skillangels_admins_mobileno_key UNIQUE (mobileno);
 [   ALTER TABLE ONLY public.skillangels_admin DROP CONSTRAINT skillangels_admins_mobileno_key;
       public         postgres    false    209            �           2606    145149 )   skillangels_admin skillangels_admins_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.skillangels_admin
    ADD CONSTRAINT skillangels_admins_pkey PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.skillangels_admin DROP CONSTRAINT skillangels_admins_pkey;
       public         postgres    false    209            �           2606    145151 2   skillangels_assessment skillangels_assessment_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.skillangels_assessment
    ADD CONSTRAINT skillangels_assessment_pkey PRIMARY KEY (assessid);
 \   ALTER TABLE ONLY public.skillangels_assessment DROP CONSTRAINT skillangels_assessment_pkey;
       public         postgres    false    211            �           2606    145153 @   skillangels_assessment_status skillangels_assessment_status_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_assessment_status
    ADD CONSTRAINT skillangels_assessment_status_pkey PRIMARY KEY (assess_status_id);
 j   ALTER TABLE ONLY public.skillangels_assessment_status DROP CONSTRAINT skillangels_assessment_status_pkey;
       public         postgres    false    213            �           2606    145155 D   skillangels_branch_installation skillangels_branch_installation_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_branch_installation
    ADD CONSTRAINT skillangels_branch_installation_pkey PRIMARY KEY (id);
 n   ALTER TABLE ONLY public.skillangels_branch_installation DROP CONSTRAINT skillangels_branch_installation_pkey;
       public         postgres    false    215            �           2606    145157 F   skillangels_branchgradecyclegame skillangels_branchgradecyclegame_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_branchgradecyclegame
    ADD CONSTRAINT skillangels_branchgradecyclegame_pkey PRIMARY KEY (bgcg_id);
 p   ALTER TABLE ONLY public.skillangels_branchgradecyclegame DROP CONSTRAINT skillangels_branchgradecyclegame_pkey;
       public         postgres    false    217            �           2606    145159 :   skillangels_current_server skillangels_current_server_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.skillangels_current_server
    ADD CONSTRAINT skillangels_current_server_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.skillangels_current_server DROP CONSTRAINT skillangels_current_server_pkey;
       public         postgres    false    220            �           2606    145161 (   skillangels_cycle skillangels_cycle_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.skillangels_cycle
    ADD CONSTRAINT skillangels_cycle_pkey PRIMARY KEY (cycle_id);
 R   ALTER TABLE ONLY public.skillangels_cycle DROP CONSTRAINT skillangels_cycle_pkey;
       public         postgres    false    222            �           2606    145163 6   skillangels_eod_mail_log skillangels_eod_mail_log_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.skillangels_eod_mail_log
    ADD CONSTRAINT skillangels_eod_mail_log_pkey PRIMARY KEY (id);
 `   ALTER TABLE ONLY public.skillangels_eod_mail_log DROP CONSTRAINT skillangels_eod_mail_log_pkey;
       public         postgres    false    223            �           2606    145165 (   skillangels_event skillangels_event_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.skillangels_event
    ADD CONSTRAINT skillangels_event_pkey PRIMARY KEY (event_id);
 R   ALTER TABLE ONLY public.skillangels_event DROP CONSTRAINT skillangels_event_pkey;
       public         postgres    false    226            �           2606    145167 .   skillangels_feedback skillangels_feedback_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public.skillangels_feedback
    ADD CONSTRAINT skillangels_feedback_pkey PRIMARY KEY (sf_id);
 X   ALTER TABLE ONLY public.skillangels_feedback DROP CONSTRAINT skillangels_feedback_pkey;
       public         postgres    false    228            �           2606    145169 2   skillangels_gamemaster skillangels_gamemaster_pkey 
   CONSTRAINT     u   ALTER TABLE ONLY public.skillangels_gamemaster
    ADD CONSTRAINT skillangels_gamemaster_pkey PRIMARY KEY (game_id);
 \   ALTER TABLE ONLY public.skillangels_gamemaster DROP CONSTRAINT skillangels_gamemaster_pkey;
       public         postgres    false    230            �           2606    145171 :   skillangels_gameques_entry skillangels_gameques_entry_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_gameques_entry
    ADD CONSTRAINT skillangels_gameques_entry_pkey PRIMARY KEY (gameques_id);
 d   ALTER TABLE ONLY public.skillangels_gameques_entry DROP CONSTRAINT skillangels_gameques_entry_pkey;
       public         postgres    false    231            �           2606    145173 @   skillangels_games_cylce_entry skillangels_games_cylce_entry_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_cylce_entry
    ADD CONSTRAINT skillangels_games_cylce_entry_pkey PRIMARY KEY (games_cycle_entry_id);
 j   ALTER TABLE ONLY public.skillangels_games_cylce_entry DROP CONSTRAINT skillangels_games_cylce_entry_pkey;
       public         postgres    false    233                       2606    145175 4   skillangels_games_entry skillangels_games_entry_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public.skillangels_games_entry
    ADD CONSTRAINT skillangels_games_entry_pkey PRIMARY KEY (games_entry_id);
 ^   ALTER TABLE ONLY public.skillangels_games_entry DROP CONSTRAINT skillangels_games_entry_pkey;
       public         postgres    false    235                       2606    145177 1   skillangels_grade skillangels_grade_gradename_key 
   CONSTRAINT     q   ALTER TABLE ONLY public.skillangels_grade
    ADD CONSTRAINT skillangels_grade_gradename_key UNIQUE (gradename);
 [   ALTER TABLE ONLY public.skillangels_grade DROP CONSTRAINT skillangels_grade_gradename_key;
       public         postgres    false    237                       2606    145179 (   skillangels_grade skillangels_grade_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.skillangels_grade
    ADD CONSTRAINT skillangels_grade_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.skillangels_grade DROP CONSTRAINT skillangels_grade_pkey;
       public         postgres    false    237                       2606    145181 :   skillangels_gradecyclegame skillangels_gradecyclegame_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.skillangels_gradecyclegame
    ADD CONSTRAINT skillangels_gradecyclegame_pkey PRIMARY KEY (gcg_id);
 d   ALTER TABLE ONLY public.skillangels_gradecyclegame DROP CONSTRAINT skillangels_gradecyclegame_pkey;
       public         postgres    false    239            	           2606    145183 ;   skillangels_langconfig skillangels_langconfig_lang_name_key 
   CONSTRAINT     {   ALTER TABLE ONLY public.skillangels_langconfig
    ADD CONSTRAINT skillangels_langconfig_lang_name_key UNIQUE (lang_name);
 e   ALTER TABLE ONLY public.skillangels_langconfig DROP CONSTRAINT skillangels_langconfig_lang_name_key;
       public         postgres    false    241                       2606    145185 2   skillangels_langconfig skillangels_langconfig_pkey 
   CONSTRAINT     u   ALTER TABLE ONLY public.skillangels_langconfig
    ADD CONSTRAINT skillangels_langconfig_pkey PRIMARY KEY (lang_id);
 \   ALTER TABLE ONLY public.skillangels_langconfig DROP CONSTRAINT skillangels_langconfig_pkey;
       public         postgres    false    241                       2606    145187 .   skillangels_loginlog skillangels_loginlog_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.skillangels_loginlog
    ADD CONSTRAINT skillangels_loginlog_pkey PRIMARY KEY (llid);
 X   ALTER TABLE ONLY public.skillangels_loginlog DROP CONSTRAINT skillangels_loginlog_pkey;
       public         postgres    false    243                       2606    145189 >   skillangels_musicconfig skillangels_musicconfig_music_name_key 
   CONSTRAINT        ALTER TABLE ONLY public.skillangels_musicconfig
    ADD CONSTRAINT skillangels_musicconfig_music_name_key UNIQUE (music_name);
 h   ALTER TABLE ONLY public.skillangels_musicconfig DROP CONSTRAINT skillangels_musicconfig_music_name_key;
       public         postgres    false    245                       2606    145191 4   skillangels_musicconfig skillangels_musicconfig_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.skillangels_musicconfig
    ADD CONSTRAINT skillangels_musicconfig_pkey PRIMARY KEY (music_id);
 ^   ALTER TABLE ONLY public.skillangels_musicconfig DROP CONSTRAINT skillangels_musicconfig_pkey;
       public         postgres    false    245                       2606    145193 <   skillangels_otherlang_words skillangels_otherlang_words_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public.skillangels_otherlang_words
    ADD CONSTRAINT skillangels_otherlang_words_pkey PRIMARY KEY (ol_id);
 f   ALTER TABLE ONLY public.skillangels_otherlang_words DROP CONSTRAINT skillangels_otherlang_words_pkey;
       public         postgres    false    247                       2606    145195 *   skillangels_scheme skillangels_scheme_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.skillangels_scheme
    ADD CONSTRAINT skillangels_scheme_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.skillangels_scheme DROP CONSTRAINT skillangels_scheme_pkey;
       public         postgres    false    250                       2606    145197 <   skillangels_school_holidays skillangels_school_holidays_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.skillangels_school_holidays
    ADD CONSTRAINT skillangels_school_holidays_pkey PRIMARY KEY (id);
 f   ALTER TABLE ONLY public.skillangels_school_holidays DROP CONSTRAINT skillangels_school_holidays_pkey;
       public         postgres    false    254                       2606    145199 1   skillangels_school skillangels_school_phoneno_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.skillangels_school
    ADD CONSTRAINT skillangels_school_phoneno_key UNIQUE (phoneno);
 [   ALTER TABLE ONLY public.skillangels_school DROP CONSTRAINT skillangels_school_phoneno_key;
       public         postgres    false    252                       2606    145201 *   skillangels_school skillangels_school_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.skillangels_school
    ADD CONSTRAINT skillangels_school_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.skillangels_school DROP CONSTRAINT skillangels_school_pkey;
       public         postgres    false    252                       2606    145203 :   skillangels_schoolacademic skillangels_schoolacademic_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.skillangels_schoolacademic
    ADD CONSTRAINT skillangels_schoolacademic_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.skillangels_schoolacademic DROP CONSTRAINT skillangels_schoolacademic_pkey;
       public         postgres    false    256                       2606    145205 >   skillangels_schoolbranch skillangels_schoolbranch_mobileno_key 
   CONSTRAINT     }   ALTER TABLE ONLY public.skillangels_schoolbranch
    ADD CONSTRAINT skillangels_schoolbranch_mobileno_key UNIQUE (mobileno);
 h   ALTER TABLE ONLY public.skillangels_schoolbranch DROP CONSTRAINT skillangels_schoolbranch_mobileno_key;
       public         postgres    false    258            !           2606    145207 6   skillangels_schoolbranch skillangels_schoolbranch_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.skillangels_schoolbranch
    ADD CONSTRAINT skillangels_schoolbranch_pkey PRIMARY KEY (id);
 `   ALTER TABLE ONLY public.skillangels_schoolbranch DROP CONSTRAINT skillangels_schoolbranch_pkey;
       public         postgres    false    258            #           2606    145209 0   skillangels_schoolday skillangels_schoolday_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.skillangels_schoolday
    ADD CONSTRAINT skillangels_schoolday_pkey PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.skillangels_schoolday DROP CONSTRAINT skillangels_schoolday_pkey;
       public         postgres    false    260            %           2606    145211 4   skillangels_schoolgrade skillangels_schoolgrade_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.skillangels_schoolgrade
    ADD CONSTRAINT skillangels_schoolgrade_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.skillangels_schoolgrade DROP CONSTRAINT skillangels_schoolgrade_pkey;
       public         postgres    false    262            '           2606    145213 D   skillangels_schoolgradesections skillangels_schoolgradesections_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_schoolgradesections
    ADD CONSTRAINT skillangels_schoolgradesections_pkey PRIMARY KEY (id);
 n   ALTER TABLE ONLY public.skillangels_schoolgradesections DROP CONSTRAINT skillangels_schoolgradesections_pkey;
       public         postgres    false    264            )           2606    145215 6   skillangels_schoolperiod skillangels_schoolperiod_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.skillangels_schoolperiod
    ADD CONSTRAINT skillangels_schoolperiod_pkey PRIMARY KEY (id);
 `   ALTER TABLE ONLY public.skillangels_schoolperiod DROP CONSTRAINT skillangels_schoolperiod_pkey;
       public         postgres    false    266            +           2606    145217 <   skillangels_schooltimetable skillangels_schooltimetable_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.skillangels_schooltimetable
    ADD CONSTRAINT skillangels_schooltimetable_pkey PRIMARY KEY (id);
 f   ALTER TABLE ONLY public.skillangels_schooltimetable DROP CONSTRAINT skillangels_schooltimetable_pkey;
       public         postgres    false    268            -           2606    145219 0   skillangels_sitewords skillangels_sitewords_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.skillangels_sitewords
    ADD CONSTRAINT skillangels_sitewords_pkey PRIMARY KEY (engid);
 Z   ALTER TABLE ONLY public.skillangels_sitewords DROP CONSTRAINT skillangels_sitewords_pkey;
       public         postgres    false    270            /           2606    145221 (   skillangels_skill skillangels_skill_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.skillangels_skill
    ADD CONSTRAINT skillangels_skill_pkey PRIMARY KEY (skill_id);
 R   ALTER TABLE ONLY public.skillangels_skill DROP CONSTRAINT skillangels_skill_pkey;
       public         postgres    false    272            1           2606    145223 :   skillangels_skillkit_games skillangels_skillkit_games_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.skillangels_skillkit_games
    ADD CONSTRAINT skillangels_skillkit_games_pkey PRIMARY KEY (skg_id);
 d   ALTER TABLE ONLY public.skillangels_skillkit_games DROP CONSTRAINT skillangels_skillkit_games_pkey;
       public         postgres    false    274            3           2606    145225 H   skillangels_skillkit_usermaxscore skillangels_skillkit_usermaxscore_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkit_usermaxscore
    ADD CONSTRAINT skillangels_skillkit_usermaxscore_pkey PRIMARY KEY (skillkit_ums_id);
 r   ALTER TABLE ONLY public.skillangels_skillkit_usermaxscore DROP CONSTRAINT skillangels_skillkit_usermaxscore_pkey;
       public         postgres    false    276            5           2606    145227 P   skillangels_skillkitgames_cylce_entry skillangels_skillkitgames_cylce_entry_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry
    ADD CONSTRAINT skillangels_skillkitgames_cylce_entry_pkey PRIMARY KEY (skillkitgames_cycle_entry_id);
 z   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry DROP CONSTRAINT skillangels_skillkitgames_cylce_entry_pkey;
       public         postgres    false    278            7           2606    145229 8   skillangels_skillkitscore skillangels_skillkitscore_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public.skillangels_skillkitscore
    ADD CONSTRAINT skillangels_skillkitscore_pkey PRIMARY KEY (skscore_id);
 b   ALTER TABLE ONLY public.skillangels_skillkitscore DROP CONSTRAINT skillangels_skillkitscore_pkey;
       public         postgres    false    280            9           2606    145231 4   skillangels_themeconfig skillangels_themeconfig_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.skillangels_themeconfig
    ADD CONSTRAINT skillangels_themeconfig_pkey PRIMARY KEY (theme_id);
 ^   ALTER TABLE ONLY public.skillangels_themeconfig DROP CONSTRAINT skillangels_themeconfig_pkey;
       public         postgres    false    282            ;           2606    145233 >   skillangels_themeconfig skillangels_themeconfig_theme_name_key 
   CONSTRAINT        ALTER TABLE ONLY public.skillangels_themeconfig
    ADD CONSTRAINT skillangels_themeconfig_theme_name_key UNIQUE (theme_name);
 h   ALTER TABLE ONLY public.skillangels_themeconfig DROP CONSTRAINT skillangels_themeconfig_theme_name_key;
       public         postgres    false    282            =           2606    145235 L   skillangels_training_gameques_entry skillangels_training_gameques_entry_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_training_gameques_entry
    ADD CONSTRAINT skillangels_training_gameques_entry_pkey PRIMARY KEY (gameques_train_id);
 v   ALTER TABLE ONLY public.skillangels_training_gameques_entry DROP CONSTRAINT skillangels_training_gameques_entry_pkey;
       public         postgres    false    285            ?           2606    145237 B   skillangels_training_userscore skillangels_training_userscore_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_training_userscore
    ADD CONSTRAINT skillangels_training_userscore_pkey PRIMARY KEY (userscore_train_id);
 l   ALTER TABLE ONLY public.skillangels_training_userscore DROP CONSTRAINT skillangels_training_userscore_pkey;
       public         postgres    false    286            A           2606    145239 <   skillangels_userfinishcycle skillangels_userfinishcycle_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public.skillangels_userfinishcycle
    ADD CONSTRAINT skillangels_userfinishcycle_pkey PRIMARY KEY (ufc_id);
 f   ALTER TABLE ONLY public.skillangels_userfinishcycle DROP CONSTRAINT skillangels_userfinishcycle_pkey;
       public         postgres    false    288            C           2606    145241 6   skillangels_usermaxscore skillangels_usermaxscore_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.skillangels_usermaxscore
    ADD CONSTRAINT skillangels_usermaxscore_pkey PRIMARY KEY (ums_id);
 `   ALTER TABLE ONLY public.skillangels_usermaxscore DROP CONSTRAINT skillangels_usermaxscore_pkey;
       public         postgres    false    290            E           2606    145243 .   skillangels_userrole skillangels_userrole_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.skillangels_userrole
    ADD CONSTRAINT skillangels_userrole_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.skillangels_userrole DROP CONSTRAINT skillangels_userrole_pkey;
       public         postgres    false    292            I           2606    145245 0   skillangels_userscore skillangels_userscore_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.skillangels_userscore
    ADD CONSTRAINT skillangels_userscore_pkey PRIMARY KEY (userscore_id);
 Z   ALTER TABLE ONLY public.skillangels_userscore DROP CONSTRAINT skillangels_userscore_pkey;
       public         postgres    false    295            K           2606    145247 :   skillangels_usertotalvalue skillangels_usertotalvalue_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.skillangels_usertotalvalue
    ADD CONSTRAINT skillangels_usertotalvalue_pkey PRIMARY KEY (utv_id);
 d   ALTER TABLE ONLY public.skillangels_usertotalvalue DROP CONSTRAINT skillangels_usertotalvalue_pkey;
       public         postgres    false    297            M           2606    145249 B   skillangels_usertotalvalue skillangels_usertotalvalue_user_id_akey 
   CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_usertotalvalue
    ADD CONSTRAINT skillangels_usertotalvalue_user_id_akey UNIQUE (user_id);
 l   ALTER TABLE ONLY public.skillangels_usertotalvalue DROP CONSTRAINT skillangels_usertotalvalue_user_id_akey;
       public         postgres    false    297            O           2606    145251 (   user_login_status user_login_status_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.user_login_status
    ADD CONSTRAINT user_login_status_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.user_login_status DROP CONSTRAINT user_login_status_pkey;
       public         postgres    false    298            �           2620    145252 *   skillangels_userscore change_finish_status    TRIGGER     �   CREATE TRIGGER change_finish_status AFTER INSERT ON public.skillangels_userscore FOR EACH ROW EXECUTE PROCEDURE public.set_finish_status();
 C   DROP TRIGGER change_finish_status ON public.skillangels_userscore;
       public       postgres    false    361    295            �           2620    145253 @   skillangels_training_userscore change_finish_status_ass2training    TRIGGER     �   CREATE TRIGGER change_finish_status_ass2training AFTER INSERT ON public.skillangels_training_userscore FOR EACH ROW EXECUTE PROCEDURE public.set_finish_status_ass2training();
 Y   DROP TRIGGER change_finish_status_ass2training ON public.skillangels_training_userscore;
       public       postgres    false    362    286            �           2620    145254 6   skillangels_skillkitscore change_skillkitfinish_status    TRIGGER     �   CREATE TRIGGER change_skillkitfinish_status AFTER INSERT ON public.skillangels_skillkitscore FOR EACH ROW EXECUTE PROCEDURE public.set_skillkitfinish_status();
 O   DROP TRIGGER change_skillkitfinish_status ON public.skillangels_skillkitscore;
       public       postgres    false    363    280            �           2620    145255 <   skillangels_games_cylce_entry cycle_push_restriction_trigger    TRIGGER     �   CREATE TRIGGER cycle_push_restriction_trigger BEFORE INSERT ON public.skillangels_games_cylce_entry FOR EACH ROW EXECUTE PROCEDURE public.cycle_push_restriction();
 U   DROP TRIGGER cycle_push_restriction_trigger ON public.skillangels_games_cylce_entry;
       public       postgres    false    233    301            �           2620    145256 (   skillangels_admin skillangels_admin_pkey    TRIGGER     �   CREATE TRIGGER skillangels_admin_pkey BEFORE INSERT ON public.skillangels_admin FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_admin_pkey();
 A   DROP TRIGGER skillangels_admin_pkey ON public.skillangels_admin;
       public       postgres    false    209    305            �           2620    145257 D   skillangels_branch_installation skillangels_branch_installation_pkey    TRIGGER     �   CREATE TRIGGER skillangels_branch_installation_pkey BEFORE INSERT ON public.skillangels_branch_installation FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_branch_installation_pkey();
 ]   DROP TRIGGER skillangels_branch_installation_pkey ON public.skillangels_branch_installation;
       public       postgres    false    215    306            �           2620    145258 F   skillangels_branchgradecyclegame skillangels_branchgradecyclegame_pkey    TRIGGER     �   CREATE TRIGGER skillangels_branchgradecyclegame_pkey BEFORE INSERT ON public.skillangels_branchgradecyclegame FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_branchgradecyclegame_pkey();
 _   DROP TRIGGER skillangels_branchgradecyclegame_pkey ON public.skillangels_branchgradecyclegame;
       public       postgres    false    217    307            �           2620    145259 0   skillangels_crownylog skillangels_crownylog_pkey    TRIGGER     �   CREATE TRIGGER skillangels_crownylog_pkey BEFORE INSERT ON public.skillangels_crownylog FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_crownylog_pkey();
 I   DROP TRIGGER skillangels_crownylog_pkey ON public.skillangels_crownylog;
       public       postgres    false    308    218            �           2620    145260 :   skillangels_current_server skillangels_current_server_pkey    TRIGGER     �   CREATE TRIGGER skillangels_current_server_pkey BEFORE INSERT ON public.skillangels_current_server FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_current_server_pkey();
 S   DROP TRIGGER skillangels_current_server_pkey ON public.skillangels_current_server;
       public       postgres    false    309    220            �           2620    145261 :   skillangels_gameques_entry skillangels_gameques_entry_pkey    TRIGGER     �   CREATE TRIGGER skillangels_gameques_entry_pkey BEFORE INSERT ON public.skillangels_gameques_entry FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_gameques_entry_pkey();
 S   DROP TRIGGER skillangels_gameques_entry_pkey ON public.skillangels_gameques_entry;
       public       postgres    false    231    310            �           2620    145262 9   skillangels_userfinishcycle skillangels_games_cylce_entry    TRIGGER     �   CREATE TRIGGER skillangels_games_cylce_entry AFTER INSERT ON public.skillangels_userfinishcycle FOR EACH ROW EXECUTE PROCEDURE public.update_cycle_entry();
 R   DROP TRIGGER skillangels_games_cylce_entry ON public.skillangels_userfinishcycle;
       public       postgres    false    288    367            �           2620    145263 @   skillangels_games_cylce_entry skillangels_games_cylce_entry_pkey    TRIGGER     �   CREATE TRIGGER skillangels_games_cylce_entry_pkey BEFORE INSERT ON public.skillangels_games_cylce_entry FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_games_cylce_entry_pkey();
 Y   DROP TRIGGER skillangels_games_cylce_entry_pkey ON public.skillangels_games_cylce_entry;
       public       postgres    false    311    233            �           2620    145264 4   skillangels_games_entry skillangels_games_entry_pkey    TRIGGER     �   CREATE TRIGGER skillangels_games_entry_pkey BEFORE INSERT ON public.skillangels_games_entry FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_games_entry_pkey();
 M   DROP TRIGGER skillangels_games_entry_pkey ON public.skillangels_games_entry;
       public       postgres    false    235    312            �           2620    145265 .   skillangels_loginlog skillangels_loginlog_pkey    TRIGGER     �   CREATE TRIGGER skillangels_loginlog_pkey BEFORE INSERT ON public.skillangels_loginlog FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_loginlog_pkey();
 G   DROP TRIGGER skillangels_loginlog_pkey ON public.skillangels_loginlog;
       public       postgres    false    243    325            �           2620    145266 <   skillangels_school_holidays skillangels_school_holidays_pkey    TRIGGER     �   CREATE TRIGGER skillangels_school_holidays_pkey BEFORE INSERT ON public.skillangels_school_holidays FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_school_holidays_pkey();
 U   DROP TRIGGER skillangels_school_holidays_pkey ON public.skillangels_school_holidays;
       public       postgres    false    254    326            �           2620    145267 :   skillangels_schoolacademic skillangels_schoolacademic_pkey    TRIGGER     �   CREATE TRIGGER skillangels_schoolacademic_pkey BEFORE INSERT ON public.skillangels_schoolacademic FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_schoolacademic_pkey();
 S   DROP TRIGGER skillangels_schoolacademic_pkey ON public.skillangels_schoolacademic;
       public       postgres    false    256    327            �           2620    145268 7   skillangels_schoolbranch skillangels_schoolbranch_bcode    TRIGGER     �   CREATE TRIGGER skillangels_schoolbranch_bcode BEFORE INSERT ON public.skillangels_schoolbranch FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_schoolbranch_bcode();
 P   DROP TRIGGER skillangels_schoolbranch_bcode ON public.skillangels_schoolbranch;
       public       postgres    false    258    333            �           2620    145269 4   skillangels_schoolgrade skillangels_schoolgrade_pkey    TRIGGER     �   CREATE TRIGGER skillangels_schoolgrade_pkey BEFORE INSERT ON public.skillangels_schoolgrade FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_schoolgrade_pkey();
 M   DROP TRIGGER skillangels_schoolgrade_pkey ON public.skillangels_schoolgrade;
       public       postgres    false    334    262            �           2620    145270 D   skillangels_schoolgradesections skillangels_schoolgradesections_pkey    TRIGGER     �   CREATE TRIGGER skillangels_schoolgradesections_pkey BEFORE INSERT ON public.skillangels_schoolgradesections FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_schoolgradesections_pkey();
 ]   DROP TRIGGER skillangels_schoolgradesections_pkey ON public.skillangels_schoolgradesections;
       public       postgres    false    264    302            �           2620    145271 6   skillangels_schoolperiod skillangels_schoolperiod_pkey    TRIGGER     �   CREATE TRIGGER skillangels_schoolperiod_pkey BEFORE INSERT ON public.skillangels_schoolperiod FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_schoolperiod_pkey();
 O   DROP TRIGGER skillangels_schoolperiod_pkey ON public.skillangels_schoolperiod;
       public       postgres    false    303    266            �           2620    145272 <   skillangels_schooltimetable skillangels_schooltimetable_pkey    TRIGGER     �   CREATE TRIGGER skillangels_schooltimetable_pkey BEFORE INSERT ON public.skillangels_schooltimetable FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_schooltimetable_pkey();
 U   DROP TRIGGER skillangels_schooltimetable_pkey ON public.skillangels_schooltimetable;
       public       postgres    false    349    268            �           2620    145273 H   skillangels_skillkit_usermaxscore skillangels_skillkit_usermaxscore_pkey    TRIGGER     �   CREATE TRIGGER skillangels_skillkit_usermaxscore_pkey BEFORE INSERT ON public.skillangels_skillkit_usermaxscore FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_skillkit_usermaxscore_pkey();
 a   DROP TRIGGER skillangels_skillkit_usermaxscore_pkey ON public.skillangels_skillkit_usermaxscore;
       public       postgres    false    350    276            �           2620    145274 ?   skillangels_skillkitscore skillangels_skillkitgames_cylce_entry    TRIGGER     �   CREATE TRIGGER skillangels_skillkitgames_cylce_entry AFTER INSERT ON public.skillangels_skillkitscore FOR EACH ROW EXECUTE PROCEDURE public.enter_skillkitgames_cylce();
 X   DROP TRIGGER skillangels_skillkitgames_cylce_entry ON public.skillangels_skillkitscore;
       public       postgres    false    280    331            �           2620    145275 P   skillangels_skillkitgames_cylce_entry skillangels_skillkitgames_cylce_entry_pkey    TRIGGER     �   CREATE TRIGGER skillangels_skillkitgames_cylce_entry_pkey BEFORE INSERT ON public.skillangels_skillkitgames_cylce_entry FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_skillkitgames_cylce_entry_pkey();
 i   DROP TRIGGER skillangels_skillkitgames_cylce_entry_pkey ON public.skillangels_skillkitgames_cylce_entry;
       public       postgres    false    278    351            �           2620    145276 8   skillangels_skillkitscore skillangels_skillkitscore_pkey    TRIGGER     �   CREATE TRIGGER skillangels_skillkitscore_pkey BEFORE INSERT ON public.skillangels_skillkitscore FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_skillkitscore_pkey();
 Q   DROP TRIGGER skillangels_skillkitscore_pkey ON public.skillangels_skillkitscore;
       public       postgres    false    280    352            �           2620    145277 L   skillangels_training_gameques_entry skillangels_training_gameques_entry_pkey    TRIGGER     �   CREATE TRIGGER skillangels_training_gameques_entry_pkey BEFORE INSERT ON public.skillangels_training_gameques_entry FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_training_gameques_entry_pkey();
 e   DROP TRIGGER skillangels_training_gameques_entry_pkey ON public.skillangels_training_gameques_entry;
       public       postgres    false    353    285            �           2620    145278 B   skillangels_training_userscore skillangels_training_userscore_pkey    TRIGGER     �   CREATE TRIGGER skillangels_training_userscore_pkey BEFORE INSERT ON public.skillangels_training_userscore FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_training_userscore_pkey();
 [   DROP TRIGGER skillangels_training_userscore_pkey ON public.skillangels_training_userscore;
       public       postgres    false    286    354            �           2620    145279 1   skillangels_userscore skillangels_userfinishcycle    TRIGGER     �   CREATE TRIGGER skillangels_userfinishcycle AFTER INSERT ON public.skillangels_userscore FOR EACH ROW EXECUTE PROCEDURE public.enter_ass_sess_cycle_score();
 J   DROP TRIGGER skillangels_userfinishcycle ON public.skillangels_userscore;
       public       postgres    false    328    295            �           2620    145280 <   skillangels_userfinishcycle skillangels_userfinishcycle_pkey    TRIGGER     �   CREATE TRIGGER skillangels_userfinishcycle_pkey BEFORE INSERT ON public.skillangels_userfinishcycle FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_userfinishcycle_pkey();
 U   DROP TRIGGER skillangels_userfinishcycle_pkey ON public.skillangels_userfinishcycle;
       public       postgres    false    355    288            �           2620    145281 .   skillangels_userscore skillangels_usermaxscore    TRIGGER     �   CREATE TRIGGER skillangels_usermaxscore AFTER INSERT ON public.skillangels_userscore FOR EACH ROW EXECUTE PROCEDURE public.enter_max_ass_cycle_score();
 G   DROP TRIGGER skillangels_usermaxscore ON public.skillangels_userscore;
       public       postgres    false    330    295            �           2620    145282 6   skillangels_usermaxscore skillangels_usermaxscore_pkey    TRIGGER     �   CREATE TRIGGER skillangels_usermaxscore_pkey BEFORE INSERT ON public.skillangels_usermaxscore FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_usermaxscore_pkey();
 O   DROP TRIGGER skillangels_usermaxscore_pkey ON public.skillangels_usermaxscore;
       public       postgres    false    290    356            �           2620    145283 (   skillangels_users skillangels_users_pkey    TRIGGER     �   CREATE TRIGGER skillangels_users_pkey BEFORE INSERT ON public.skillangels_users FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_users_pkey();
 A   DROP TRIGGER skillangels_users_pkey ON public.skillangels_users;
       public       postgres    false    357    293            �           2620    145284 0   skillangels_userscore skillangels_userscore_pkey    TRIGGER     �   CREATE TRIGGER skillangels_userscore_pkey BEFORE INSERT ON public.skillangels_userscore FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_userscore_pkey();
 I   DROP TRIGGER skillangels_userscore_pkey ON public.skillangels_userscore;
       public       postgres    false    358    295            �           2620    145285 :   skillangels_usertotalvalue skillangels_usertotalvalue_pkey    TRIGGER     �   CREATE TRIGGER skillangels_usertotalvalue_pkey BEFORE INSERT ON public.skillangels_usertotalvalue FOR EACH ROW EXECUTE PROCEDURE public.new_skillangels_usertotalvalue_pkey();
 S   DROP TRIGGER skillangels_usertotalvalue_pkey ON public.skillangels_usertotalvalue;
       public       postgres    false    359    297            �           2620    145286 <   skillangels_skillkitscore skillkit_enter_max_ass_cycle_score    TRIGGER     �   CREATE TRIGGER skillkit_enter_max_ass_cycle_score AFTER INSERT ON public.skillangels_skillkitscore FOR EACH ROW EXECUTE PROCEDURE public.skillkit_enter_max_ass_cycle_score();
 U   DROP TRIGGER skillkit_enter_max_ass_cycle_score ON public.skillangels_skillkitscore;
       public       postgres    false    280    366            �           2620    145287 /   skillangels_userfinishcycle skillkiteligibility    TRIGGER     �   CREATE TRIGGER skillkiteligibility AFTER INSERT ON public.skillangels_userfinishcycle FOR EACH ROW EXECUTE PROCEDURE public.check_skillkit_eligibility();
 H   DROP TRIGGER skillkiteligibility ON public.skillangels_userfinishcycle;
       public       postgres    false    300    288            W           2606    145288 (   skillangels_crownylog crownylog_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_crownylog
    ADD CONSTRAINT crownylog_uid_fkey FOREIGN KEY (uid) REFERENCES public.skillangels_users(id);
 R   ALTER TABLE ONLY public.skillangels_crownylog DROP CONSTRAINT crownylog_uid_fkey;
       public       postgres    false    3399    218    293            P           2606    145293 '   schoolconfig schoolconfig_schoolid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.schoolconfig
    ADD CONSTRAINT schoolconfig_schoolid_fkey FOREIGN KEY (schoolid) REFERENCES public.skillangels_schoolbranch(id);
 Q   ALTER TABLE ONLY public.schoolconfig DROP CONSTRAINT schoolconfig_schoolid_fkey;
       public       postgres    false    206    258    3361            �           2606    145298 1   skillangels_users skillangel_users_school_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_users
    ADD CONSTRAINT skillangel_users_school_id_fkey FOREIGN KEY (branch_id) REFERENCES public.skillangels_schoolbranch(id);
 [   ALTER TABLE ONLY public.skillangels_users DROP CONSTRAINT skillangel_users_school_id_fkey;
       public       postgres    false    3361    293    258            Q           2606    145303 2   skillangels_admin skillangels_admin_branch_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_admin
    ADD CONSTRAINT skillangels_admin_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.skillangels_schoolbranch(id);
 \   ALTER TABLE ONLY public.skillangels_admin DROP CONSTRAINT skillangels_admin_branch_id_fkey;
       public       postgres    false    209    258    3361            R           2606    145308 2   skillangels_admin skillangels_admin_school_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_admin
    ADD CONSTRAINT skillangels_admin_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.skillangels_school(id);
 \   ALTER TABLE ONLY public.skillangels_admin DROP CONSTRAINT skillangels_admin_school_id_fkey;
       public       postgres    false    3353    209    252            S           2606    145313 0   skillangels_admin skillangels_admins_roleid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_admin
    ADD CONSTRAINT skillangels_admins_roleid_fkey FOREIGN KEY (roleid) REFERENCES public.skillangels_userrole(id);
 Z   ALTER TABLE ONLY public.skillangels_admin DROP CONSTRAINT skillangels_admins_roleid_fkey;
       public       postgres    false    209    292    3397            T           2606    145318 N   skillangels_branch_installation skillangels_branch_installation_branch_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_branch_installation
    ADD CONSTRAINT skillangels_branch_installation_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.skillangels_schoolbranch(id);
 x   ALTER TABLE ONLY public.skillangels_branch_installation DROP CONSTRAINT skillangels_branch_installation_branch_id_fkey;
       public       postgres    false    258    215    3361            U           2606    145323 P   skillangels_branchgradecyclegame skillangels_branchgradecyclegame_branch_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_branchgradecyclegame
    ADD CONSTRAINT skillangels_branchgradecyclegame_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.skillangels_schoolbranch(id);
 z   ALTER TABLE ONLY public.skillangels_branchgradecyclegame DROP CONSTRAINT skillangels_branchgradecyclegame_branch_id_fkey;
       public       postgres    false    217    258    3361            V           2606    145328 M   skillangels_branchgradecyclegame skillangels_branchgradecyclegame_gcg_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_branchgradecyclegame
    ADD CONSTRAINT skillangels_branchgradecyclegame_gcg_id_fkey FOREIGN KEY (gcg_id) REFERENCES public.skillangels_gradecyclegame(gcg_id);
 w   ALTER TABLE ONLY public.skillangels_branchgradecyclegame DROP CONSTRAINT skillangels_branchgradecyclegame_gcg_id_fkey;
       public       postgres    false    217    3335    239            X           2606    145333 D   skillangels_current_server skillangels_current_server_branch_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_current_server
    ADD CONSTRAINT skillangels_current_server_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.skillangels_schoolbranch(id);
 n   ALTER TABLE ONLY public.skillangels_current_server DROP CONSTRAINT skillangels_current_server_branch_id_fkey;
       public       postgres    false    258    220    3361            Y           2606    145338 6   skillangels_feedback skillangels_feedback_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_feedback
    ADD CONSTRAINT skillangels_feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.skillangels_users(id);
 `   ALTER TABLE ONLY public.skillangels_feedback DROP CONSTRAINT skillangels_feedback_user_id_fkey;
       public       postgres    false    3399    293    228            Z           2606    145343 ;   skillangels_gamemaster skillangels_gamemaster_skill_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_gamemaster
    ADD CONSTRAINT skillangels_gamemaster_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skillangels_skill(skill_id);
 e   ALTER TABLE ONLY public.skillangels_gamemaster DROP CONSTRAINT skillangels_gamemaster_skill_id_fkey;
       public       postgres    false    230    3375    272            [           2606    145348 C   skillangels_gameques_entry skillangels_gameques_entry_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_gameques_entry
    ADD CONSTRAINT skillangels_gameques_entry_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.skillangels_event(event_id);
 m   ALTER TABLE ONLY public.skillangels_gameques_entry DROP CONSTRAINT skillangels_gameques_entry_event_id_fkey;
       public       postgres    false    3319    231    226            \           2606    145353 B   skillangels_gameques_entry skillangels_gameques_entry_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_gameques_entry
    ADD CONSTRAINT skillangels_gameques_entry_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.skillangels_gamemaster(game_id);
 l   ALTER TABLE ONLY public.skillangels_gameques_entry DROP CONSTRAINT skillangels_gameques_entry_game_id_fkey;
       public       postgres    false    230    231    3323            ]           2606    145358 B   skillangels_gameques_entry skillangels_gameques_entry_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_gameques_entry
    ADD CONSTRAINT skillangels_gameques_entry_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.skillangels_users(id);
 l   ALTER TABLE ONLY public.skillangels_gameques_entry DROP CONSTRAINT skillangels_gameques_entry_user_id_fkey;
       public       postgres    false    3399    231    293            ^           2606    145363 I   skillangels_games_cylce_entry skillangels_games_cylce_entry_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_cylce_entry
    ADD CONSTRAINT skillangels_games_cylce_entry_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.skillangels_event(event_id);
 s   ALTER TABLE ONLY public.skillangels_games_cylce_entry DROP CONSTRAINT skillangels_games_cylce_entry_event_id_fkey;
       public       postgres    false    233    3319    226            _           2606    145368 K   skillangels_games_cylce_entry skillangels_games_cylce_entry_fa_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_cylce_entry
    ADD CONSTRAINT skillangels_games_cylce_entry_fa_game_id_fkey FOREIGN KEY (fa_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 u   ALTER TABLE ONLY public.skillangels_games_cylce_entry DROP CONSTRAINT skillangels_games_cylce_entry_fa_game_id_fkey;
       public       postgres    false    3323    230    233            `           2606    145373 L   skillangels_games_cylce_entry skillangels_games_cylce_entry_lin_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_cylce_entry
    ADD CONSTRAINT skillangels_games_cylce_entry_lin_game_id_fkey FOREIGN KEY (lin_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 v   ALTER TABLE ONLY public.skillangels_games_cylce_entry DROP CONSTRAINT skillangels_games_cylce_entry_lin_game_id_fkey;
       public       postgres    false    233    3323    230            a           2606    145378 L   skillangels_games_cylce_entry skillangels_games_cylce_entry_mem_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_cylce_entry
    ADD CONSTRAINT skillangels_games_cylce_entry_mem_game_id_fkey FOREIGN KEY (mem_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 v   ALTER TABLE ONLY public.skillangels_games_cylce_entry DROP CONSTRAINT skillangels_games_cylce_entry_mem_game_id_fkey;
       public       postgres    false    3323    230    233            b           2606    145383 K   skillangels_games_cylce_entry skillangels_games_cylce_entry_ps_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_cylce_entry
    ADD CONSTRAINT skillangels_games_cylce_entry_ps_game_id_fkey FOREIGN KEY (ps_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 u   ALTER TABLE ONLY public.skillangels_games_cylce_entry DROP CONSTRAINT skillangels_games_cylce_entry_ps_game_id_fkey;
       public       postgres    false    233    3323    230            c           2606    145388 H   skillangels_games_cylce_entry skillangels_games_cylce_entry_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_cylce_entry
    ADD CONSTRAINT skillangels_games_cylce_entry_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.skillangels_users(id);
 r   ALTER TABLE ONLY public.skillangels_games_cylce_entry DROP CONSTRAINT skillangels_games_cylce_entry_user_id_fkey;
       public       postgres    false    233    3399    293            d           2606    145393 K   skillangels_games_cylce_entry skillangels_games_cylce_entry_vp_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_cylce_entry
    ADD CONSTRAINT skillangels_games_cylce_entry_vp_game_id_fkey FOREIGN KEY (vp_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 u   ALTER TABLE ONLY public.skillangels_games_cylce_entry DROP CONSTRAINT skillangels_games_cylce_entry_vp_game_id_fkey;
       public       postgres    false    233    230    3323            l           2606    145398 K   skillangels_gradecyclegame skillangels_gradecyclegame_assess_status_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_gradecyclegame
    ADD CONSTRAINT skillangels_gradecyclegame_assess_status_id_fkey FOREIGN KEY (assess_status_id) REFERENCES public.skillangels_assessment_status(assess_status_id);
 u   ALTER TABLE ONLY public.skillangels_gradecyclegame DROP CONSTRAINT skillangels_gradecyclegame_assess_status_id_fkey;
       public       postgres    false    213    3305    239            m           2606    145403 C   skillangels_gradecyclegame skillangels_gradecyclegame_cycle_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_gradecyclegame
    ADD CONSTRAINT skillangels_gradecyclegame_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.skillangels_cycle(cycle_id);
 m   ALTER TABLE ONLY public.skillangels_gradecyclegame DROP CONSTRAINT skillangels_gradecyclegame_cycle_id_fkey;
       public       postgres    false    222    3315    239            e           2606    145408 @   skillangels_games_entry skillangels_gradecyclegame_game_id1_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_entry
    ADD CONSTRAINT skillangels_gradecyclegame_game_id1_fkey FOREIGN KEY (vp_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 j   ALTER TABLE ONLY public.skillangels_games_entry DROP CONSTRAINT skillangels_gradecyclegame_game_id1_fkey;
       public       postgres    false    235    3323    230            f           2606    145413 @   skillangels_games_entry skillangels_gradecyclegame_game_id2_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_entry
    ADD CONSTRAINT skillangels_gradecyclegame_game_id2_fkey FOREIGN KEY (ps_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 j   ALTER TABLE ONLY public.skillangels_games_entry DROP CONSTRAINT skillangels_gradecyclegame_game_id2_fkey;
       public       postgres    false    235    230    3323            g           2606    145418 @   skillangels_games_entry skillangels_gradecyclegame_game_id3_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_entry
    ADD CONSTRAINT skillangels_gradecyclegame_game_id3_fkey FOREIGN KEY (fa_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 j   ALTER TABLE ONLY public.skillangels_games_entry DROP CONSTRAINT skillangels_gradecyclegame_game_id3_fkey;
       public       postgres    false    235    3323    230            h           2606    145423 @   skillangels_games_entry skillangels_gradecyclegame_game_id4_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_entry
    ADD CONSTRAINT skillangels_gradecyclegame_game_id4_fkey FOREIGN KEY (lin_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 j   ALTER TABLE ONLY public.skillangels_games_entry DROP CONSTRAINT skillangels_gradecyclegame_game_id4_fkey;
       public       postgres    false    235    3323    230            n           2606    145428 B   skillangels_gradecyclegame skillangels_gradecyclegame_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_gradecyclegame
    ADD CONSTRAINT skillangels_gradecyclegame_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.skillangels_gamemaster(game_id);
 l   ALTER TABLE ONLY public.skillangels_gradecyclegame DROP CONSTRAINT skillangels_gradecyclegame_game_id_fkey;
       public       postgres    false    230    239    3323            i           2606    145433 ?   skillangels_games_entry skillangels_gradecyclegame_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_entry
    ADD CONSTRAINT skillangels_gradecyclegame_game_id_fkey FOREIGN KEY (mem_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 i   ALTER TABLE ONLY public.skillangels_games_entry DROP CONSTRAINT skillangels_gradecyclegame_game_id_fkey;
       public       postgres    false    3323    230    235            o           2606    145438 C   skillangels_gradecyclegame skillangels_gradecyclegame_grade_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_gradecyclegame
    ADD CONSTRAINT skillangels_gradecyclegame_grade_id_fkey FOREIGN KEY (grade_id) REFERENCES public.skillangels_grade(id);
 m   ALTER TABLE ONLY public.skillangels_gradecyclegame DROP CONSTRAINT skillangels_gradecyclegame_grade_id_fkey;
       public       postgres    false    237    3333    239            p           2606    145443 2   skillangels_loginlog skillangels_loginlog_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_loginlog
    ADD CONSTRAINT skillangels_loginlog_uid_fkey FOREIGN KEY (uid) REFERENCES public.skillangels_users(id);
 \   ALTER TABLE ONLY public.skillangels_loginlog DROP CONSTRAINT skillangels_loginlog_uid_fkey;
       public       postgres    false    293    3399    243            q           2606    145448 D   skillangels_otherlang_words skillangels_otherlang_words_lang_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_otherlang_words
    ADD CONSTRAINT skillangels_otherlang_words_lang_id_fkey FOREIGN KEY (lang_id) REFERENCES public.skillangels_langconfig(lang_id);
 n   ALTER TABLE ONLY public.skillangels_otherlang_words DROP CONSTRAINT skillangels_otherlang_words_lang_id_fkey;
       public       postgres    false    241    3339    247            r           2606    145453 D   skillangels_otherlang_words skillangels_otherlang_words_wordnum_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_otherlang_words
    ADD CONSTRAINT skillangels_otherlang_words_wordnum_fkey FOREIGN KEY (wordnum) REFERENCES public.skillangels_sitewords(engid);
 n   ALTER TABLE ONLY public.skillangels_otherlang_words DROP CONSTRAINT skillangels_otherlang_words_wordnum_fkey;
       public       postgres    false    270    3373    247            s           2606    145458 6   skillangels_sbc_game skillangels_sbc_game_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_sbc_game
    ADD CONSTRAINT skillangels_sbc_game_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.skillangels_gamemaster(game_id);
 `   ALTER TABLE ONLY public.skillangels_sbc_game DROP CONSTRAINT skillangels_sbc_game_game_id_fkey;
       public       postgres    false    230    248    3323            t           2606    145463 7   skillangels_sbc_game skillangels_sbc_game_grade_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_sbc_game
    ADD CONSTRAINT skillangels_sbc_game_grade_id_fkey FOREIGN KEY (grade_id) REFERENCES public.skillangels_grade(id);
 a   ALTER TABLE ONLY public.skillangels_sbc_game DROP CONSTRAINT skillangels_sbc_game_grade_id_fkey;
       public       postgres    false    237    248    3333            u           2606    145468 4   skillangels_school skillangels_school_countryid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_school
    ADD CONSTRAINT skillangels_school_countryid_fkey FOREIGN KEY (countryid) REFERENCES public.country_timezone(id);
 ^   ALTER TABLE ONLY public.skillangels_school DROP CONSTRAINT skillangels_school_countryid_fkey;
       public       postgres    false    252    199    3289            x           2606    145473 C   skillangels_school_holidays skillangels_school_holidays_branch_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_school_holidays
    ADD CONSTRAINT skillangels_school_holidays_branch_fkey FOREIGN KEY (branch) REFERENCES public.skillangels_schoolbranch(id);
 m   ALTER TABLE ONLY public.skillangels_school_holidays DROP CONSTRAINT skillangels_school_holidays_branch_fkey;
       public       postgres    false    3361    254    258            v           2606    145478 /   skillangels_school skillangels_school_role_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_school
    ADD CONSTRAINT skillangels_school_role_fkey FOREIGN KEY (role) REFERENCES public.skillangels_userrole(id);
 Y   ALTER TABLE ONLY public.skillangels_school DROP CONSTRAINT skillangels_school_role_fkey;
       public       postgres    false    292    3397    252            w           2606    145483 3   skillangels_school skillangels_school_schemeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_school
    ADD CONSTRAINT skillangels_school_schemeid_fkey FOREIGN KEY (schemeid) REFERENCES public.skillangels_scheme(id);
 ]   ALTER TABLE ONLY public.skillangels_school DROP CONSTRAINT skillangels_school_schemeid_fkey;
       public       postgres    false    252    3349    250            y           2606    145488 C   skillangels_schoolacademic skillangels_schoolacademic_schoolid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_schoolacademic
    ADD CONSTRAINT skillangels_schoolacademic_schoolid_fkey FOREIGN KEY (schoolid) REFERENCES public.skillangels_schoolbranch(id);
 m   ALTER TABLE ONLY public.skillangels_schoolacademic DROP CONSTRAINT skillangels_schoolacademic_schoolid_fkey;
       public       postgres    false    3361    258    256            z           2606    145493 @   skillangels_schoolbranch skillangels_schoolbranch_countryid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_schoolbranch
    ADD CONSTRAINT skillangels_schoolbranch_countryid_fkey FOREIGN KEY (countryid) REFERENCES public.country_timezone(id);
 j   ALTER TABLE ONLY public.skillangels_schoolbranch DROP CONSTRAINT skillangels_schoolbranch_countryid_fkey;
       public       postgres    false    258    199    3289            {           2606    145498 ?   skillangels_schoolbranch skillangels_schoolbranch_schoolid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_schoolbranch
    ADD CONSTRAINT skillangels_schoolbranch_schoolid_fkey FOREIGN KEY (schoolid) REFERENCES public.skillangels_school(id);
 i   ALTER TABLE ONLY public.skillangels_schoolbranch DROP CONSTRAINT skillangels_schoolbranch_schoolid_fkey;
       public       postgres    false    252    258    3353            |           2606    145503 <   skillangels_schoolgrade skillangels_schoolgrade_gradeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_schoolgrade
    ADD CONSTRAINT skillangels_schoolgrade_gradeid_fkey FOREIGN KEY (gradeid) REFERENCES public.skillangels_grade(id);
 f   ALTER TABLE ONLY public.skillangels_schoolgrade DROP CONSTRAINT skillangels_schoolgrade_gradeid_fkey;
       public       postgres    false    262    3333    237            }           2606    145508 =   skillangels_schoolgrade skillangels_schoolgrade_schoolid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_schoolgrade
    ADD CONSTRAINT skillangels_schoolgrade_schoolid_fkey FOREIGN KEY (branch_id) REFERENCES public.skillangels_schoolbranch(id);
 g   ALTER TABLE ONLY public.skillangels_schoolgrade DROP CONSTRAINT skillangels_schoolgrade_schoolid_fkey;
       public       postgres    false    262    3361    258            ~           2606    145513 M   skillangels_schoolgradesections skillangels_schoolgradesections_branchid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_schoolgradesections
    ADD CONSTRAINT skillangels_schoolgradesections_branchid_fkey FOREIGN KEY (branchid) REFERENCES public.skillangels_schoolbranch(id);
 w   ALTER TABLE ONLY public.skillangels_schoolgradesections DROP CONSTRAINT skillangels_schoolgradesections_branchid_fkey;
       public       postgres    false    258    3361    264                       2606    145518 L   skillangels_schoolgradesections skillangels_schoolgradesections_gradeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_schoolgradesections
    ADD CONSTRAINT skillangels_schoolgradesections_gradeid_fkey FOREIGN KEY (gradeid) REFERENCES public.skillangels_schoolgrade(id);
 v   ALTER TABLE ONLY public.skillangels_schoolgradesections DROP CONSTRAINT skillangels_schoolgradesections_gradeid_fkey;
       public       postgres    false    264    262    3365            �           2606    145523 ?   skillangels_schoolperiod skillangels_schoolperiod_schoolid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_schoolperiod
    ADD CONSTRAINT skillangels_schoolperiod_schoolid_fkey FOREIGN KEY (branchid) REFERENCES public.skillangels_schoolbranch(id);
 i   ALTER TABLE ONLY public.skillangels_schoolperiod DROP CONSTRAINT skillangels_schoolperiod_schoolid_fkey;
       public       postgres    false    266    258    3361            �           2606    145528 E   skillangels_schooltimetable skillangels_schooltimetable_branchid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_schooltimetable
    ADD CONSTRAINT skillangels_schooltimetable_branchid_fkey FOREIGN KEY (branchid) REFERENCES public.skillangels_schoolbranch(id);
 o   ALTER TABLE ONLY public.skillangels_schooltimetable DROP CONSTRAINT skillangels_schooltimetable_branchid_fkey;
       public       postgres    false    268    258    3361            �           2606    145533 B   skillangels_schooltimetable skillangels_schooltimetable_dayid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_schooltimetable
    ADD CONSTRAINT skillangels_schooltimetable_dayid_fkey FOREIGN KEY (dayid) REFERENCES public.skillangels_schoolday(id);
 l   ALTER TABLE ONLY public.skillangels_schooltimetable DROP CONSTRAINT skillangels_schooltimetable_dayid_fkey;
       public       postgres    false    268    3363    260            �           2606    145538 E   skillangels_schooltimetable skillangels_schooltimetable_periodid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_schooltimetable
    ADD CONSTRAINT skillangels_schooltimetable_periodid_fkey FOREIGN KEY (periodid) REFERENCES public.skillangels_schoolperiod(id);
 o   ALTER TABLE ONLY public.skillangels_schooltimetable DROP CONSTRAINT skillangels_schooltimetable_periodid_fkey;
       public       postgres    false    268    3369    266            �           2606    145543 F   skillangels_schooltimetable skillangels_schooltimetable_sectionid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_schooltimetable
    ADD CONSTRAINT skillangels_schooltimetable_sectionid_fkey FOREIGN KEY (sectionid) REFERENCES public.skillangels_schoolgradesections(id);
 p   ALTER TABLE ONLY public.skillangels_schooltimetable DROP CONSTRAINT skillangels_schooltimetable_sectionid_fkey;
       public       postgres    false    268    3367    264            �           2606    145548 B   skillangels_skillkit_games skillangels_skillkit_games_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkit_games
    ADD CONSTRAINT skillangels_skillkit_games_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.skillangels_gamemaster(game_id);
 l   ALTER TABLE ONLY public.skillangels_skillkit_games DROP CONSTRAINT skillangels_skillkit_games_game_id_fkey;
       public       postgres    false    274    230    3323            �           2606    145553 C   skillangels_skillkit_games skillangels_skillkit_games_grade_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkit_games
    ADD CONSTRAINT skillangels_skillkit_games_grade_id_fkey FOREIGN KEY (grade_id) REFERENCES public.skillangels_grade(id);
 m   ALTER TABLE ONLY public.skillangels_skillkit_games DROP CONSTRAINT skillangels_skillkit_games_grade_id_fkey;
       public       postgres    false    3333    274    237            �           2606    145558 P   skillangels_skillkit_usermaxscore skillangels_skillkit_usermaxscore_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkit_usermaxscore
    ADD CONSTRAINT skillangels_skillkit_usermaxscore_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.skillangels_users(id);
 z   ALTER TABLE ONLY public.skillangels_skillkit_usermaxscore DROP CONSTRAINT skillangels_skillkit_usermaxscore_user_id_fkey;
       public       postgres    false    276    3399    293            �           2606    145563 Y   skillangels_skillkitgames_cylce_entry skillangels_skillkitgames_cylce_entry_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry
    ADD CONSTRAINT skillangels_skillkitgames_cylce_entry_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.skillangels_event(event_id);
 �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry DROP CONSTRAINT skillangels_skillkitgames_cylce_entry_event_id_fkey;
       public       postgres    false    3319    226    278            �           2606    145568 [   skillangels_skillkitgames_cylce_entry skillangels_skillkitgames_cylce_entry_fa_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry
    ADD CONSTRAINT skillangels_skillkitgames_cylce_entry_fa_game_id_fkey FOREIGN KEY (fa_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry DROP CONSTRAINT skillangels_skillkitgames_cylce_entry_fa_game_id_fkey;
       public       postgres    false    230    3323    278            �           2606    145573 \   skillangels_skillkitgames_cylce_entry skillangels_skillkitgames_cylce_entry_lin_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry
    ADD CONSTRAINT skillangels_skillkitgames_cylce_entry_lin_game_id_fkey FOREIGN KEY (lin_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry DROP CONSTRAINT skillangels_skillkitgames_cylce_entry_lin_game_id_fkey;
       public       postgres    false    3323    278    230            �           2606    145578 \   skillangels_skillkitgames_cylce_entry skillangels_skillkitgames_cylce_entry_mem_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry
    ADD CONSTRAINT skillangels_skillkitgames_cylce_entry_mem_game_id_fkey FOREIGN KEY (mem_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry DROP CONSTRAINT skillangels_skillkitgames_cylce_entry_mem_game_id_fkey;
       public       postgres    false    278    230    3323            �           2606    145583 [   skillangels_skillkitgames_cylce_entry skillangels_skillkitgames_cylce_entry_ps_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry
    ADD CONSTRAINT skillangels_skillkitgames_cylce_entry_ps_game_id_fkey FOREIGN KEY (ps_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry DROP CONSTRAINT skillangels_skillkitgames_cylce_entry_ps_game_id_fkey;
       public       postgres    false    278    230    3323            �           2606    145588 X   skillangels_skillkitgames_cylce_entry skillangels_skillkitgames_cylce_entry_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry
    ADD CONSTRAINT skillangels_skillkitgames_cylce_entry_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.skillangels_users(id);
 �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry DROP CONSTRAINT skillangels_skillkitgames_cylce_entry_user_id_fkey;
       public       postgres    false    293    278    3399            �           2606    145593 [   skillangels_skillkitgames_cylce_entry skillangels_skillkitgames_cylce_entry_vp_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry
    ADD CONSTRAINT skillangels_skillkitgames_cylce_entry_vp_game_id_fkey FOREIGN KEY (vp_game_id) REFERENCES public.skillangels_gamemaster(game_id);
 �   ALTER TABLE ONLY public.skillangels_skillkitgames_cylce_entry DROP CONSTRAINT skillangels_skillkitgames_cylce_entry_vp_game_id_fkey;
       public       postgres    false    278    230    3323            �           2606    145598 A   skillangels_skillkitscore skillangels_skillkitscore_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkitscore
    ADD CONSTRAINT skillangels_skillkitscore_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.skillangels_event(event_id);
 k   ALTER TABLE ONLY public.skillangels_skillkitscore DROP CONSTRAINT skillangels_skillkitscore_event_id_fkey;
       public       postgres    false    280    226    3319            �           2606    145603 @   skillangels_skillkitscore skillangels_skillkitscore_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkitscore
    ADD CONSTRAINT skillangels_skillkitscore_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.skillangels_gamemaster(game_id);
 j   ALTER TABLE ONLY public.skillangels_skillkitscore DROP CONSTRAINT skillangels_skillkitscore_game_id_fkey;
       public       postgres    false    280    230    3323            �           2606    145608 @   skillangels_skillkitscore skillangels_skillkitscore_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_skillkitscore
    ADD CONSTRAINT skillangels_skillkitscore_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.skillangels_users(id);
 j   ALTER TABLE ONLY public.skillangels_skillkitscore DROP CONSTRAINT skillangels_skillkitscore_user_id_fkey;
       public       postgres    false    280    293    3399            �           2606    145613 U   skillangels_training_gameques_entry skillangels_training_gameques_entry_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_training_gameques_entry
    ADD CONSTRAINT skillangels_training_gameques_entry_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.skillangels_event(event_id);
    ALTER TABLE ONLY public.skillangels_training_gameques_entry DROP CONSTRAINT skillangels_training_gameques_entry_event_id_fkey;
       public       postgres    false    285    226    3319            �           2606    145618 T   skillangels_training_gameques_entry skillangels_training_gameques_entry_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_training_gameques_entry
    ADD CONSTRAINT skillangels_training_gameques_entry_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.skillangels_gamemaster(game_id);
 ~   ALTER TABLE ONLY public.skillangels_training_gameques_entry DROP CONSTRAINT skillangels_training_gameques_entry_game_id_fkey;
       public       postgres    false    285    230    3323            �           2606    145623 T   skillangels_training_gameques_entry skillangels_training_gameques_entry_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_training_gameques_entry
    ADD CONSTRAINT skillangels_training_gameques_entry_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.skillangels_users(id);
 ~   ALTER TABLE ONLY public.skillangels_training_gameques_entry DROP CONSTRAINT skillangels_training_gameques_entry_user_id_fkey;
       public       postgres    false    285    3399    293            �           2606    145628 K   skillangels_training_userscore skillangels_training_userscore_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_training_userscore
    ADD CONSTRAINT skillangels_training_userscore_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.skillangels_event(event_id);
 u   ALTER TABLE ONLY public.skillangels_training_userscore DROP CONSTRAINT skillangels_training_userscore_event_id_fkey;
       public       postgres    false    3319    286    226            �           2606    145633 J   skillangels_training_userscore skillangels_training_userscore_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_training_userscore
    ADD CONSTRAINT skillangels_training_userscore_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.skillangels_gamemaster(game_id);
 t   ALTER TABLE ONLY public.skillangels_training_userscore DROP CONSTRAINT skillangels_training_userscore_game_id_fkey;
       public       postgres    false    230    286    3323            �           2606    145638 J   skillangels_training_userscore skillangels_training_userscore_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_training_userscore
    ADD CONSTRAINT skillangels_training_userscore_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.skillangels_users(id);
 t   ALTER TABLE ONLY public.skillangels_training_userscore DROP CONSTRAINT skillangels_training_userscore_user_id_fkey;
       public       postgres    false    3399    286    293            �           2606    145643 M   skillangels_userfinishcycle skillangels_userfinishcycle_assess_status_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_userfinishcycle
    ADD CONSTRAINT skillangels_userfinishcycle_assess_status_id_fkey FOREIGN KEY (assess_status_id) REFERENCES public.skillangels_assessment_status(assess_status_id);
 w   ALTER TABLE ONLY public.skillangels_userfinishcycle DROP CONSTRAINT skillangels_userfinishcycle_assess_status_id_fkey;
       public       postgres    false    213    288    3305            �           2606    145648 E   skillangels_userfinishcycle skillangels_userfinishcycle_cycle_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_userfinishcycle
    ADD CONSTRAINT skillangels_userfinishcycle_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.skillangels_cycle(cycle_id);
 o   ALTER TABLE ONLY public.skillangels_userfinishcycle DROP CONSTRAINT skillangels_userfinishcycle_cycle_id_fkey;
       public       postgres    false    222    288    3315            �           2606    145653 D   skillangels_userfinishcycle skillangels_userfinishcycle_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_userfinishcycle
    ADD CONSTRAINT skillangels_userfinishcycle_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.skillangels_users(id);
 n   ALTER TABLE ONLY public.skillangels_userfinishcycle DROP CONSTRAINT skillangels_userfinishcycle_user_id_fkey;
       public       postgres    false    293    288    3399            �           2606    145658 ?   skillangels_usermaxscore skillangels_usermaxscore_cycle_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_usermaxscore
    ADD CONSTRAINT skillangels_usermaxscore_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.skillangels_cycle(cycle_id);
 i   ALTER TABLE ONLY public.skillangels_usermaxscore DROP CONSTRAINT skillangels_usermaxscore_cycle_id_fkey;
       public       postgres    false    3315    290    222            �           2606    145663 >   skillangels_usermaxscore skillangels_usermaxscore_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_usermaxscore
    ADD CONSTRAINT skillangels_usermaxscore_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.skillangels_users(id);
 h   ALTER TABLE ONLY public.skillangels_usermaxscore DROP CONSTRAINT skillangels_usermaxscore_user_id_fkey;
       public       postgres    false    290    293    3399            j           2606    145668 .   skillangels_games_entry skillangels_users_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_entry
    ADD CONSTRAINT skillangels_users_fkey FOREIGN KEY (user_id) REFERENCES public.skillangels_users(id);
 X   ALTER TABLE ONLY public.skillangels_games_entry DROP CONSTRAINT skillangels_users_fkey;
       public       postgres    false    3399    235    293            �           2606    145673 3   skillangels_users skillangels_users_section_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_users
    ADD CONSTRAINT skillangels_users_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.skillangels_schoolgradesections(id);
 ]   ALTER TABLE ONLY public.skillangels_users DROP CONSTRAINT skillangels_users_section_id_fkey;
       public       postgres    false    264    293    3367            �           2606    145678 6   skillangels_users skillangels_users_selected_lang_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_users
    ADD CONSTRAINT skillangels_users_selected_lang_fkey FOREIGN KEY (selected_lang) REFERENCES public.skillangels_langconfig(lang_id);
 `   ALTER TABLE ONLY public.skillangels_users DROP CONSTRAINT skillangels_users_selected_lang_fkey;
       public       postgres    false    241    293    3339            �           2606    145683 7   skillangels_users skillangels_users_selected_music_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_users
    ADD CONSTRAINT skillangels_users_selected_music_fkey FOREIGN KEY (selected_music) REFERENCES public.skillangels_musicconfig(music_id);
 a   ALTER TABLE ONLY public.skillangels_users DROP CONSTRAINT skillangels_users_selected_music_fkey;
       public       postgres    false    245    293    3345            �           2606    145688 7   skillangels_users skillangels_users_selected_theme_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_users
    ADD CONSTRAINT skillangels_users_selected_theme_fkey FOREIGN KEY (selected_theme) REFERENCES public.skillangels_themeconfig(theme_id);
 a   ALTER TABLE ONLY public.skillangels_users DROP CONSTRAINT skillangels_users_selected_theme_fkey;
       public       postgres    false    282    293    3385            �           2606    145693 9   skillangels_userscore skillangels_userscore_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_userscore
    ADD CONSTRAINT skillangels_userscore_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.skillangels_event(event_id);
 c   ALTER TABLE ONLY public.skillangels_userscore DROP CONSTRAINT skillangels_userscore_event_id_fkey;
       public       postgres    false    295    3319    226            k           2606    145698 ;   skillangels_games_entry skillangels_userscore_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_games_entry
    ADD CONSTRAINT skillangels_userscore_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.skillangels_event(event_id);
 e   ALTER TABLE ONLY public.skillangels_games_entry DROP CONSTRAINT skillangels_userscore_event_id_fkey;
       public       postgres    false    235    226    3319            �           2606    145703 8   skillangels_userscore skillangels_userscore_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_userscore
    ADD CONSTRAINT skillangels_userscore_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.skillangels_gamemaster(game_id);
 b   ALTER TABLE ONLY public.skillangels_userscore DROP CONSTRAINT skillangels_userscore_game_id_fkey;
       public       postgres    false    3323    295    230            �           2606    145708 8   skillangels_userscore skillangels_userscore_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_userscore
    ADD CONSTRAINT skillangels_userscore_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.skillangels_users(id);
 b   ALTER TABLE ONLY public.skillangels_userscore DROP CONSTRAINT skillangels_userscore_user_id_fkey;
       public       postgres    false    293    295    3399            �           2606    145713 B   skillangels_usertotalvalue skillangels_usertotalvalue_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillangels_usertotalvalue
    ADD CONSTRAINT skillangels_usertotalvalue_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.skillangels_users(id);
 l   ALTER TABLE ONLY public.skillangels_usertotalvalue DROP CONSTRAINT skillangels_usertotalvalue_user_id_fkey;
       public       postgres    false    293    297    3399            D      x������ � �      F      x������ � �      J      x������ � �      M      x������ � �      P      x������ � �      R      x������ � �      T      x������ � �      V      x������ � �      X      x������ � �      Y      x������ � �      [      x������ � �      ]      x������ � �      ^      x������ � �      a      x������ � �      c      x������ � �      e      x������ � �      f      x������ � �      h      x������ � �      j      x������ � �      l      x������ � �      n      x������ � �      p      x������ � �      r      x������ � �      t      x������ � �      v      x������ � �      w      x������ � �      y      x������ � �      {      x������ � �      }      x������ � �            x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �     