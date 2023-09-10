
from email.header import decode_header
import imaplib
import email
import datetime
import sys


f = open("emails.txt", "w", encoding="utf-8")
x = open("realout.txt", "w", encoding="utf-8")
#connecting to gmail 
imap = imaplib.IMAP4_SSL('imap.gmail.com')
print("EHLLOOOOO")
print((sys.argv[2]))
key = "ON"
date = datetime.date.today().strftime("%d-%b-%Y")
imap.login((sys.argv[1]), (sys.argv[2]))

status, messages = imap.select('INBOX')
#stores every single email in a tuple
typ, data = imap.search(None, 'ON', date)
messages = data[0].split()

for message in messages:
    res, msg = imap.fetch(message, '(RFC822)')
    for response in msg:
        if isinstance(response, tuple):
            msg = email.message_from_bytes(response[1])
            subject, encoding = decode_header(msg['Subject'])[0]
            if isinstance(subject, bytes) and encoding != None:
                subject= subject.decode(encoding)
            From, encoding = decode_header(msg['From'])[0]
            if isinstance(From, bytes) and From != None:
                From = From.decode(encoding)
            print("SUBJECT: ", subject)
            f.write(f"SUBJECT: {subject}")
            print("FROM: ", From)
            f.write(f"FROM:  {From}")
            if msg.is_multipart():
                for part in msg.walk():
                    content_type = part.get_content_type()
                    content_disposition = str(part.get("Content-Disposition"))
                    try:
                        body= part.get_payload(decode=True).decode("utf-8")
                    except:
                        pass
                    if content_type == "text/plain":
                        f.write((body))

                        break
                    
            else:
                content_type = msg.get_content_type()
                body = msg.get_payload(decode=True).decode("utf-8")
                if content_type == "text/plain":
                    f.write((body))

                    break

f.close()

f = open("emails.txt", "r", encoding="utf-8")
for line in f: 
    if line == "\n":
        continue
    else: x.write(line)



f.close()
x.close()
imap.close()
imap.logout()
sys.stdout.flush()



#user, password = "adityadesai753@gmail.com", "znysvmlpczattlsv"c
